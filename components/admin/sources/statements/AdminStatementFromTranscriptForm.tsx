'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { Field, Fieldset, Legend, Textarea } from '@headlessui/react'
import { z } from 'zod'
import { Label } from '../../forms/Label'
import { Controller, useForm } from 'react-hook-form'
import { AdminSourceSpeakerSelect } from './AdminSourceSpeakerSelect'
import { ErrorMessage } from '../../forms/ErrorMessage'
import { statementSchema } from '@/libs/sources/statement-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { AdminPageTitle } from '../../layout/AdminPageTitle'
import { AdminFormActions } from '../../layout/AdminFormActions'
import { AdminStatementTypeSelect } from './AdminStatementTypeSelect'
import { AdminEvaluatorSelector } from './AdminEvaluatorSelect'
import { useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { StatementType } from '@/__generated__/graphql'

const AdminStatementFromTranscriptFormFragment = gql(`
  fragment AdminStatementFromTranscriptForm on Query {
    ...AdminExpertSelect
  }
`)

const AdminStatementFromTranscriptDataFragment = gql(`
  fragment AdminStatementFromTranscriptData on Source {
    id
    sourceSpeakers {
      id
    }
    ...AdminSourceSpeakerSelect
  }
`)

export const CreateStatementMutation = gql(`
  mutation CreateStatementFromTranscript($statementInput: CreateStatementInput!) {
    createStatement(statementInput: $statementInput) {
      statement {
        id
      }
    }
  }
`)

type FieldValues = z.output<typeof statementSchema>

export function AdminStatementFromTranscriptForm(props: {
  statementTranscriptPosition: {
    startLine: number
    startOffset: number
    endLine: number
    endOffset: number
    text: string
  }
  source: FragmentType<typeof AdminStatementFromTranscriptDataFragment>
  data: FragmentType<typeof AdminStatementFromTranscriptFormFragment>
  onCancel: () => void
  onSuccess: () => void
}) {
  const { onSuccess, statementTranscriptPosition } = props

  const source = useFragment(
    AdminStatementFromTranscriptDataFragment,
    props.source
  )

  const data = useFragment(AdminStatementFromTranscriptFormFragment, props.data)

  const [createStatement, { loading }] = useMutation(CreateStatementMutation)

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FieldValues>({
    resolver: zodResolver(statementSchema),
    defaultValues: {
      sourceId: source.id,
      statementType: 'factual',
      sourceSpeakerId: source.sourceSpeakers?.[0]?.id ?? '',
      evaluatorId: '',
      content: statementTranscriptPosition.text,
    },
  })

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      await createStatement({
        variables: {
          statementInput: {
            content: data.content,
            sourceSpeakerId: data.sourceSpeakerId,
            assessment: {
              evaluatorId: data.evaluatorId,
            },
            sourceId: data.sourceId,
            statementType: StatementType.Factual,
            firstCommentContent: data.firstCommentContent,

            excerptedAt: new Date().toISOString(),
            important: false,
            published: false,
            statementTranscriptPosition: {
              startLine: statementTranscriptPosition.startLine,
              startOffset: statementTranscriptPosition.startOffset,
              endLine: statementTranscriptPosition.endLine,
              endOffset: statementTranscriptPosition.endOffset,
            },
          },
        },
        onCompleted: () => {
          onSuccess()
        },
      })
    },
    [createStatement, onSuccess, statementTranscriptPosition]
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 py-6 border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
    >
      <input type="hidden" {...register('sourceId')} />

      <AdminFormHeader>
        <AdminPageTitle title="Nový výrok" />
        <AdminFormActions>
          <button
            type="submit"
            className="text-sm font-semibold leading-6 text-gray-900"
            disabled={loading}
          >
            Vytvořit
          </button>
          <a
            className="text-sm font-semibold leading-6 text-gray-900"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              props.onCancel()
            }}
          >
            Zrušit
          </a>
        </AdminFormActions>
      </AdminFormHeader>
      <AdminFormContent className="flex-col">
        <div className="col-span-12">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Základní údaje
            </Legend>
            <Field className="w-full">
              <Label htmlFor="content">Text výroku</Label>
              <Textarea
                id="content"
                className="w-full sm:text-sm text-gray-900 rounded-md shadow-sm border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                {...register('content', { required: true })}
                rows={10}
                placeholder="Vložte či vepište znění..."
              />

              <ErrorMessage message={errors.content?.message} />
            </Field>
            <Field>
              <Label htmlFor="sourceSpeakerId">Řečník</Label>

              <Controller
                control={control}
                name="sourceSpeakerId"
                render={({ field }) => (
                  <>
                    <input type="hidden" {...field} />
                    <AdminSourceSpeakerSelect
                      id="sourceSpeakerId"
                      data={source}
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </>
                )}
              />

              <ErrorMessage message={errors.sourceSpeakerId?.message} />
            </Field>
            <Field>
              <Label htmlFor="statementType">Typ výroku</Label>

              <Controller
                control={control}
                name="statementType"
                render={({ field }) => (
                  <>
                    <input type="hidden" {...field} />
                    <AdminStatementTypeSelect
                      id="statementType"
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </>
                )}
              />

              <ErrorMessage message={errors.statementType?.message} />
            </Field>
          </Fieldset>
          <Fieldset className="space-y-4 mt-2 w-full">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Ověřování
            </Legend>
            <Field>
              <Label htmlFor="evaluatorId" isOptional>
                Ověřovatel
              </Label>

              <Controller
                control={control}
                name="evaluatorId"
                render={({ field }) => (
                  <>
                    <input type="hidden" {...field} />
                    <AdminEvaluatorSelector
                      id="evaluatorId"
                      data={data}
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </>
                )}
              />

              <ErrorMessage message={errors.evaluatorId?.message} />
            </Field>
            <Field>
              <Label htmlFor="firstCommentContent" isOptional>
                Poznámka pro ověřování
              </Label>

              <Textarea
                id="firstCommentContent"
                {...register('firstCommentContent')}
                rows={5}
                placeholder="Vložte či vepište znění..."
                className="w-full sm:text-sm text-gray-900 rounded-md shadow-sm border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p className="text-sm  text-gray-500">
                Bude přidána jako první komentář v diskuzi k výroku.
              </p>
            </Field>
          </Fieldset>
        </div>
      </AdminFormContent>
    </form>
  )
}
