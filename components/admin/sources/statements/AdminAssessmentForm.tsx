'use client'

import dynamic from 'next/dynamic'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import { machine } from '@/libs/sources/machines/assessment-process-machine'
import { useActorRef, useMachine, useSelector } from '@xstate/react'
import React, { useMemo } from 'react'
import { useFormState } from 'react-dom'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { FormAction } from '@/libs/forms/form-action'
import { z } from 'zod'
import { assessmentSchema } from '@/libs/sources/statement-schema'
import { useFormToasts } from '../../forms/hooks/use-form-toasts'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { AdminPageTitle } from '../../layout/AdminPageTitle'
import { AdminFormActions } from '../../layout/AdminFormActions'
import { LinkButton } from '../../forms/LinkButton'
import { SubmitButton } from '../../forms/SubmitButton'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { Label } from '../../forms/Label'
import { ErrorMessage } from '../../forms/ErrorMessage'
import { AdminSourceSpeakerControl } from './controls/AdminSourceSpeakerControl'
import { Input } from '../../forms/Input'
import { AdminStatementTagsMultiselect } from './controls/AdminTagsMultiselect'
import { Textarea } from '../../forms/Textarea'
import { StatementType } from '@/__generated__/graphql'
import { AdminPromiseRatingSelect } from './controls/AdminPromiseRatingSelect'
import classNames from 'classnames'
import { AdminVeracitySelect } from './controls/AdminVeracitySelect'
import { AdminStatement } from '../../articles/segments/AdminStatement'
import { AdminArticleQuote } from '../../articles/segments/AdminArticleQuote'
import { AdminArticleV2Preview } from '../../articles/AdminArticlePreview'
import { useStatementEvaluationMachine } from './hooks/statement-evaluation-machine'

const RichTextEditor = dynamic(
  () => import('@/components/admin/forms/RichTextEditor'),
  { ssr: false }
)

const SHORT_EXPLANATION_LIMIT = 280

const PROMISE_RATING_COLORS = {
  fulfilled: 'text-green-700',
  broken: 'text-red-500',
  in_progress: 'text-yellow-500',
  partially_fulfilled: 'text-blue-400',
  stalled: 'text-amber-500',
  not_yet_evaluated: 'text-amber-500',
}

const VERACITY_COLORS: Record<string, string> = {
  true: 'text-green-700',
  untrue: 'text-red-500',
  misleading: 'text-amber-500',
  unverifiable: 'text-blue-400',
}

const AdminAssessmentFormFragment = gql(`
  fragment AdminAssessmentForm on Query {
    ...StatementEvaluationMachineQueryData
    ...AdminStatementTags
    ...AdminPromiseRatingSelect
    ...AdminVeracitySelect
  }  
`)

const AdminStatementAssessmentFragment = gql(`
  fragment AdminStatementAssessment on Statement {
    ...StatementEvaluationMachine
    statementType
    title
    content
    sourceSpeaker {
      id
      fullName
    }
    source {
      id
      ...AdminSourceSpeakerControl
    }
    assessment {
      evaluator {
        id
      }
      evaluationStatus
      explanation
      shortExplanation
      promiseRating {
        id
        key
        name
      }
      veracity {
        id
        key
        name
      }
      assessmentMethodology {
        ratingKeys
      }
      explanationContent {
        edges {
          node {
            ... on ArticleNode {
              article {
                ...AdminArticleV2Preview
              }
            }
            ... on TextNode {
              text
            }
            ... on BlockQuoteNode {
              ...AdminArticleQuote
            }
            ... on StatementNode {
              statement {
                ...AdminStatement
              }
            }
          }
          cursor
        }
      }
    }
    tags {
      id
    }
    ...AdminStatementForTags
  }  
`)

type FieldValues = z.output<typeof assessmentSchema>

export function AdminAssessmentForm(props: {
  action: FormAction
  data: FragmentType<typeof AdminAssessmentFormFragment>
  statement: FragmentType<typeof AdminStatementAssessmentFragment>
}) {
  const data = useFragment(AdminAssessmentFormFragment, props.data)
  const statement = useFragment(
    AdminStatementAssessmentFragment,
    props.statement
  )

  const {
    isFactual,
    isPromise,
    isStatementFieldDisabled,
    isStatementRatingDisabled,
  } = useStatementEvaluationMachine({
    data,
    statement,
  })

  const [formState, formAction] = useFormState(props.action, {
    state: 'initial',
  })

  useFormToasts(formState)

  const {
    watch,
    control,
    register,
    formState: { errors, isValid },
    trigger,
  } = useForm<FieldValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      statementType: statement.statementType,
      sourceSpeakerId: statement.sourceSpeaker.id,
      title: statement.title ?? '',
      tags: statement.tags.map((tag) => tag.id),
      content: statement.content,
      explanation: statement.assessment.explanation ?? undefined,
      shortExplanation: statement.assessment.shortExplanation ?? undefined,
      ...(statement.statementType === StatementType.Promise
        ? {
            promiseRatingId: statement.assessment.promiseRating?.id,
          }
        : {
            veracityId: statement.assessment.veracity?.id,
          }),
    },
  })

  const shortExplanation = watch('shortExplanation')

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  const title = useMemo(
    () => (isPromise ? 'Detail slibu' : 'Detail výroku'),
    [isPromise]
  )

  const description = useMemo(() => {
    if (isFactual) {
      return `Ověřování faktického výroku ${statement.sourceSpeaker.fullName}`
    }

    if (isPromise) {
      return `Ověřování slibu ${statement.sourceSpeaker.fullName}`
    }

    return `Ověřování silvestrovského výroku ${statement.sourceSpeaker.fullName}`
  }, [isPromise, isFactual, statement.sourceSpeaker.fullName])

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <input type="hidden" {...register('statementType')} />

      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={title} description={description} />

          <AdminFormActions>
            <LinkButton href={`/beta/admin/sources/${statement.source.id}`}>
              Zpět
            </LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>
        <AdminFormContent className="flex-col">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Výrok
            </Legend>

            <Field>
              <Label htmlFor="sourceSpeakerId">Řečník</Label>

              <AdminSourceSpeakerControl
                name="sourceSpeakerId"
                disabled={isStatementFieldDisabled}
                control={control}
                data={statement.source}
              />

              <ErrorMessage message={errors.sourceSpeakerId?.message} />
            </Field>

            {isPromise && (
              <Field>
                <Label htmlFor="title">Titulek</Label>

                <Input
                  id="title"
                  disabled={isStatementFieldDisabled}
                  {...register('title')}
                />

                <ErrorMessage message={errors.title?.message} />
              </Field>
            )}

            {(isPromise || isFactual) && (
              <Field>
                <Label htmlFor="tags" isOptional>
                  Štítky
                </Label>

                <AdminStatementTagsMultiselect
                  disabled={isStatementFieldDisabled}
                  control={control}
                  name="tags"
                  data={data}
                  statement={statement}
                />

                <ErrorMessage message={errors.tags?.message} />
              </Field>
            )}

            <Field>
              <Label htmlFor="content">Text výroku</Label>

              <Textarea
                id="content"
                {...register('content')}
                rows={5}
                placeholder={`Zadejte text ${isPromise ? 'slibu' : 'výroku'}...`}
                disabled={isStatementFieldDisabled}
              />

              <ErrorMessage message={errors.content?.message} />
            </Field>
          </Fieldset>

          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Ověřování
            </Legend>

            {isPromise && (
              <Field>
                <Label htmlFor="promiseRatingId">Hodnocení slibu</Label>

                {isStatementRatingDisabled ? (
                  <p>
                    {!statement.assessment.promiseRating && 'Zatím nehodnoceno'}

                    {statement.assessment.promiseRating && (
                      <span
                        className={classNames(
                          'text-lg font-bold',
                          PROMISE_RATING_COLORS[
                            statement.assessment.promiseRating.key
                          ]
                        )}
                      >
                        {statement.assessment.promiseRating.name}
                      </span>
                    )}
                  </p>
                ) : (
                  <AdminPromiseRatingSelect
                    control={control}
                    name="promiseRatingId"
                    data={data}
                    allowedKeys={
                      statement.assessment.assessmentMethodology.ratingKeys
                    }
                  />
                )}

                <ErrorMessage message={errors.promiseRatingId?.message} />
              </Field>
            )}

            {!isPromise && (
              <Field>
                <Label htmlFor="veracityId">Hodnocení výroku</Label>

                {isStatementRatingDisabled ? (
                  <p>
                    {!statement.assessment.veracity && 'Zatím nehodnoceno'}

                    {statement.assessment.veracity && (
                      <span
                        className={classNames(
                          'text-lg font-bold',
                          VERACITY_COLORS[statement.assessment.veracity.key]
                        )}
                      >
                        {statement.assessment.veracity.name}
                      </span>
                    )}
                  </p>
                ) : (
                  <AdminVeracitySelect
                    control={control}
                    name="veracityId"
                    data={data}
                  />
                )}

                <ErrorMessage message={errors.veracityId?.message} />
              </Field>
            )}

            <Field>
              <Label htmlFor="shortExplanation">Odůvodnění zkráceně</Label>

              {isStatementFieldDisabled ? (
                <p className="mt-4">{shortExplanation}</p>
              ) : (
                <>
                  <Textarea
                    id="shortExplanation"
                    {...register('shortExplanation')}
                    rows={3}
                    placeholder={`Zadejte zkráceně odůvodnění ${isPromise ? 'slibu' : 'výroku'}...`}
                    disabled={isStatementFieldDisabled}
                    maxLength={SHORT_EXPLANATION_LIMIT}
                  />

                  <div className="text-sm text-gray-600 mt-2">
                    Maximálně na dlouhý tweet, tj. {SHORT_EXPLANATION_LIMIT}{' '}
                    znaků. Aktuálně {shortExplanation?.length} znaků.
                  </div>
                </>
              )}

              <ErrorMessage message={errors.shortExplanation?.message} />
            </Field>

            <Field>
              <Label htmlFor="explanation">Odůvodnění</Label>

              {isStatementFieldDisabled ? (
                <div className="mt-10 max-w-3xl article-content">
                  {statement.assessment.explanationContent.edges?.map(
                    (edge) => {
                      if (!edge?.node) {
                        return null
                      }

                      const { node, cursor } = edge

                      if (node.__typename === 'TextNode') {
                        return (
                          <div
                            key={cursor}
                            dangerouslySetInnerHTML={{ __html: node.text }}
                          />
                        )
                      }

                      if (
                        node.__typename === 'StatementNode' &&
                        node.statement
                      ) {
                        return (
                          <AdminStatement
                            className="mt-8"
                            key={cursor}
                            statement={node.statement}
                          />
                        )
                      }

                      if (node.__typename === 'BlockQuoteNode') {
                        return <AdminArticleQuote key={cursor} node={node} />
                      }

                      if (node.__typename === 'ArticleNode' && node.article) {
                        return (
                          <AdminArticleV2Preview
                            isRedesign={true}
                            key={cursor}
                            article={node.article}
                          />
                        )
                      }
                    }
                  )}
                </div>
              ) : (
                <Controller
                  control={control}
                  name={'explanation'}
                  render={({ field }) => (
                    <div className="mt-2">
                      <input
                        type="hidden"
                        name={field.name}
                        value={field.value}
                      />
                      <RichTextEditor
                        includeHeadings
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
              )}
            </Field>
          </Fieldset>
        </AdminFormContent>
      </div>
    </form>
  )
}
