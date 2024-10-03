'use client'

import dynamic from 'next/dynamic'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { ARTICLE_TYPE_LABEL } from '@/libs/constants/article-type'
import { SubmitButton } from '@/components/admin/forms/SubmitButton'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { Switch } from '@/components/admin/forms/Switch'
import { SwitchField } from '@/components/admin/forms/SwitchField'
import { Label } from '@/components/admin/forms/Label'
import {
  ArticleTypeEnum,
  AdminArticleFormFieldsFragment as ArticleFields,
} from '@/__generated__/graphql'
import { ARTICLE_VERACITY_OPTIONS } from '@/libs/constants/article-veracity'
import { Button, Field } from '@headlessui/react'
import { Input } from '@/components/admin/forms/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { schema } from '@/libs/articles/schema'
import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { FormState } from '@/app/(admin)/admin/articles/actions'
import invariant from 'ts-invariant'
import { AdminSourcesList } from '@/components/admin/articles/AdminSourcesList'
import { ApolloProvider } from '@apollo/client'
import { createClient } from '@/libs/apollo-client'

import {
  DocumentTextIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline'
import { AdminSegmentSelector } from './AdminSegmentSelector'
import { AdminArticleIllustrationInput } from './AdminArticleIllustrationInput'
import { toArticleTypeEnum } from '@/libs/enums'
import { imagePath } from '@/libs/images/path'

const RichTextEditor = dynamic(
  () => import('@/components/admin/forms/RichTextEditor'),
  { ssr: false }
)

const items = [
  {
    segmentType: 'text' as const,
    title: 'Text',
    description: 'Přidat textový segment',
    icon: DocumentTextIcon,
    background: 'bg-pink-500',
  },
  {
    segmentType: 'source_statements' as const,
    title: 'Zdroj výroků',
    description: 'Vyberte diskuzi, jejíž výroky budou zobrazeny v článku',
    icon: ChatBubbleLeftIcon,
    background: 'bg-yellow-500',
  },
]

export const AdminArticleFormFragment = gql(`
  fragment AdminArticleForm on Query {
    articleTags {
      id
    }
  }
`)

export const AdminArticleFormFieldsFragment = gql(`
  fragment AdminArticleFormFields on Article {
    title
    titleEn
    perex
    articleType
    articleVeracity
    published
    publishedAt
    pinned
    segments {
      id
      segmentType
      textHtml
      source {
        id
      }
      statementId
    }
    ...ArticleIllustration
  }
`)

const HIDDEN_ARTICLE_TYPES = ['single_statement']

const DEFAULT_VALUES: Partial<z.output<typeof schema>> = {
  articleType: ArticleTypeEnum.Default,
  pinned: false,
  published: false,
  illustration: undefined,
  publishedAt: new Date().toISOString().substring(0, 10),
  articleTags: [],
}

function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== undefined && value !== null
}

function buildDefaultValues(
  article?: ArticleFields
): Partial<z.output<typeof schema>> {
  if (!article) {
    return DEFAULT_VALUES
  }

  const sharedFields = {
    title: article.title,
    pinned: article.pinned,
    perex: article.perex ?? '',
    published: article.pinned,
    publishedAt: article.publishedAt.substring(0, 10),
    segments: article.segments
      ?.map((segment) => {
        switch (segment.segmentType) {
          case 'text':
            return {
              segmentType: 'text' as const,
              textHtml: segment.textHtml ?? '',
            }

          case 'source_statements':
            return {
              segmentType: 'source_statements' as const,
              sourceId: segment.source?.id ?? '',
            }
          case 'promise':
            return {
              segmentType: 'promise' as const,
              statementId: segment.statementId ?? '',
            }
          default:
            return null
        }
      })
      .filter(isNotNullish),
  }

  const articleType = toArticleTypeEnum(article.articleType)

  switch (articleType) {
    case ArticleTypeEnum.FacebookFactcheck:
      return {
        articleType,
        articleVeracity: article.articleVeracity ?? '',
        titleEn: article.titleEn ?? '',
        ...sharedFields,
      }
    case ArticleTypeEnum.FacebookFactcheck:
    case ArticleTypeEnum.GovernmentPromisesEvaluation:
    case ArticleTypeEnum.SingleStatement:
    case ArticleTypeEnum.Static:
    case ArticleTypeEnum.Default:
      return {
        articleType,
        ...sharedFields,
      }

    default:
      return DEFAULT_VALUES
  }
}

export function AdminArticleForm(props: {
  data: FragmentType<typeof AdminArticleFormFragment>
  article?: FragmentType<typeof AdminArticleFormFieldsFragment>
  action(prevState: FormState, input: FormData): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { message: '' })
  const data = useFragment(AdminArticleFormFragment, props.data)
  const article = useFragment(AdminArticleFormFieldsFragment, props.article)

  const { register, watch, handleSubmit, control } = useForm<
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { ...buildDefaultValues(article), ...(state.fields ?? {}) },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'segments',
  })

  const formRef = useRef<HTMLFormElement>(null)

  const selectedArticleType = watch(
    'articleType',
    article ? toArticleTypeEnum(article.articleType) : ArticleTypeEnum.Default
  )

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(
        (data) => {
          const formElem = formRef.current
          invariant(formElem, 'Form HTML DOM element must be present.')
          formAction(new FormData(formElem))

          // TODO: @vaclavbohac Remove once we are sure the forms are bug free
          console.debug('Valid form data', data)
        },
        (data) => {
          // TODO: @vaclavbohac Remove once we are sure the forms are bug free
          console.debug('Invalid form data', data)
        }
      )}
    >
      <div className="container">
        <div className="flex gap-5 border-b border-gray-900/10 pb-12">
          <div className="grow gap-y-5 grid grid-cols-1">
            {state.error && <div className="text-red">{state.error}</div>}

            <Field>
              <Label htmlFor="title">Název článku</Label>

              <Input
                id="title"
                placeholder="Upravit název…"
                {...register('title', { required: true })}
              />
            </Field>

            {selectedArticleType === ArticleTypeEnum.FacebookFactcheck && (
              <Field>
                <Label htmlFor="titleEn">Anglický název článku</Label>

                <Input
                  id="titleEn"
                  placeholder="Upravit anglický název…"
                  {...register('titleEn', { required: true })}
                />
              </Field>
            )}

            <Field>
              <Label htmlFor="illustration">Ilustrační obrázek</Label>

              <AdminArticleIllustrationInput
                article={article}
                control={control}
                name="illustration"
              />
            </Field>

            <Field>
              <Label htmlFor="perex">Perex</Label>

              <textarea
                {...register('perex', { required: true })}
                id="perex"
                rows={4}
                className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Zadejte perex..."
              />
            </Field>

            <AdminSegmentSelector
              segments={items.map((item) => ({
                ...item,
                onClick: () => {
                  if (item.segmentType === 'text') {
                    append({ segmentType: item.segmentType, textHtml: '' })
                  } else {
                    append({ segmentType: item.segmentType, sourceId: '' })
                  }
                },
              }))}
            />

            {fields.map((field, index) => (
              <div key={field.id}>
                <input
                  type="hidden"
                  {...register(`segments.${index}.segmentType`)}
                />

                {field.segmentType === 'text' ? (
                  <>
                    <Controller
                      control={control}
                      name={`segments.${index}.textHtml`}
                      render={({ field }) => (
                        <RichTextEditor
                          includeHeadings
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    <Button onClick={() => remove(index)}>Odebrat</Button>
                  </>
                ) : (
                  <ApolloProvider client={createClient()}>
                    <Controller
                      control={control}
                      name={`segments.${index}.sourceId`}
                      render={({ field }) => (
                        <>
                          <input type="hidden" {...field} />
                          <AdminSourcesList
                            selectedSourceId={field.value}
                            onRemoveSegment={() => remove(index)}
                            onChange={(sourceId) => field.onChange(sourceId)}
                          />
                        </>
                      )}
                    ></Controller>
                  </ApolloProvider>
                )}
              </div>
            ))}

            {/*<Field>*/}
            {/*  <Label htmlFor="articleTag">Tagy článku</Label>*/}

            {/*  <select*/}
            {/*    id="articleTag"*/}
            {/*    {...register('articleTags', { required: false })}*/}
            {/*    defaultValue=""*/}
            {/*    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
            {/*  >*/}
            {/*    <option value="">Please select</option>*/}
            {/*    {data.articleTags.map((tag) => (*/}
            {/*      <option key={tag.id} value={tag.id}>*/}
            {/*        {tag.title}*/}
            {/*      </option>*/}
            {/*    ))}*/}
            {/*  </select>*/}
            {/*</Field>*/}
          </div>
          <div className="min-w-[25%] gap-y-5 grid grid-cols-1 content-start">
            <div>
              <Label htmlFor="articleType">Typ článku</Label>
              <select
                id="articleType"
                {...register('articleType', { required: true })}
                defaultValue={ArticleTypeEnum.Default}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {Object.entries(ARTICLE_TYPE_LABEL).map(([key, value]) => {
                  if (HIDDEN_ARTICLE_TYPES.includes(key)) {
                    return null
                  }

                  return (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                })}
              </select>
            </div>

            <SwitchField
              htmlFor="pinned"
              label="Připnout článek"
              description="Článek bude trvale zobrazen na hlavní stránce jako první."
            >
              <Controller
                name="pinned"
                control={control}
                render={({ field }) => (
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.value}
                    disabled={field.disabled}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </SwitchField>

            <SwitchField
              htmlFor="published"
              label="Zveřejněný článek"
              description="Článek bude veřejně dostupný."
            >
              <Controller
                name="published"
                control={control}
                render={({ field }) => (
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.value}
                    disabled={field.disabled}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </SwitchField>

            <Field>
              <Label htmlFor="publishedAt">Datum zveřejnění</Label>

              <Input
                id="publishedAt"
                type="date"
                {...register('publishedAt')}
              />
            </Field>

            <div>
              <Label htmlFor="articleVeracity">Pravdivost článku</Label>
              <select
                disabled={
                  selectedArticleType !== ArticleTypeEnum.FacebookFactcheck
                }
                id="articleVeracity"
                {...register('articleVeracity', { required: true })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
              >
                {ARTICLE_VERACITY_OPTIONS.map((articleVeracity) => (
                  <option
                    key={articleVeracity.value}
                    value={articleVeracity.value}
                  >
                    {articleVeracity.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <LinkButton href="/admin/articles">Zpět</LinkButton>

          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
