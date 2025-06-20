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
import {
  Button,
  Field,
  Fieldset,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import * as Sentry from '@sentry/nextjs'
import { Input } from '@/components/admin/forms/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { schema } from '@/libs/articles/schema'
import { useFormState } from 'react-dom'
import { AdminSourcesList } from '@/components/admin/articles/AdminSourcesList'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

import {
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  ChevronUpDownIcon,
  CheckIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { AdminSegmentSelector } from './AdminSegmentSelector'
import { AdminArticleIllustrationInput } from './AdminArticleIllustrationInput'
import { toArticleTypeEnum } from '@/libs/enums'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminFormHeader } from '@/components/admin/layout/AdminFormHeader'
import { AdminFormActions } from '../layout/AdminFormActions'
import { AdminFormContent } from '@/components/admin/layout/AdminFormContent'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { Textarea } from '@/components/admin/forms/Textarea'
import { dateInputFormat } from '@/libs/date-time'
import { FormAction } from '@/libs/forms/form-action'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { AdminFormMain } from '../layout/AdminFormMain'
import { AdminFormSidebar } from '../layout/AdminFormSidebar'
import { useEffect, useMemo } from 'react'
import { ErrorMessage } from '../forms/ErrorMessage'
import { isEmpty } from 'lodash'
import { AdminQuizQuestionList } from './AdminQuizQuestionList'
import { AdminArticlePreviewButton } from './AdminArticlePreviewButton'
import { SecondaryLinkButton } from '../layout/buttons/SecondaryLinkButton'

const RichTextEditor = dynamic(
  () => import('@/components/admin/forms/RichTextEditor'),
  { ssr: false }
)

type LocalStorageRecord = {
  perex?: string
}

function buildLocalStorageRecord(
  localStorageKey: string,
  itemPatch: Partial<LocalStorageRecord> = {}
): string {
  const serializedItem = localStorage.getItem(localStorageKey)

  const values: LocalStorageRecord = serializedItem?.length
    ? JSON.parse(serializedItem)
    : {}

  return JSON.stringify({ ...values, ...itemPatch })
}

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

  {
    segmentType: 'quiz_question' as const,
    title: 'Kvízové otázky',
    description: 'Vyberte kvíz, který bude zobrazen v článku',
    icon: AcademicCapIcon,
    background: 'bg-purple-500',
  },
]

const AdminArticleFormFragment = gql(`
  fragment AdminArticleForm on Query {
    articleTags {
      id
      title
    }
  }
`)

const AdminArticleFormFieldsFragment = gql(`
  fragment AdminArticleFormFields on Article {
    id
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
      quizQuestion {
        id
        title
        description
        quizAnswers {
          id
          text
          isCorrect
        }
      }
    }
    articleTags {
      id
    }
    illustrationCaption
    ...AdminArticleIllustration
    ...AdminArticlePreviewButton
  }
`)

const HIDDEN_ARTICLE_TYPES = ['single_statement']

const DEFAULT_VALUES: Partial<z.output<typeof schema>> = {
  articleType: ArticleTypeEnum.Default,
  pinned: false,
  published: false,
  illustration: undefined,
  publishedAt: dateInputFormat(new Date().toISOString()),
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
    published: article.published,
    publishedAt: dateInputFormat(article.publishedAt),
    articleTags: article.articleTags.map((tag) => tag.id),
    illustrationCaption: article.illustrationCaption ?? '',
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
          case 'quiz_question':
            return {
              segmentType: 'quiz_question' as const,
              quizQuestionId: segment.quizQuestion?.id ?? '',
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
    case ArticleTypeEnum.Education:
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
  title: string
  description?: string
  data: FragmentType<typeof AdminArticleFormFragment>
  article?: FragmentType<typeof AdminArticleFormFieldsFragment>
  action: FormAction
}) {
  const [state, formAction] = useFormState(props.action, {
    state: 'initial',
  })

  useFormToasts(state)

  const data = useFragment(AdminArticleFormFragment, props.data)
  const article = useFragment(AdminArticleFormFieldsFragment, props.article)

  const {
    register,
    reset,
    watch,
    trigger,
    control,
    setValue,
    formState: {
      isValid,
      dirtyFields: { perex: isPerexDirty },
      errors,
    },
  } = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      perex: article?.perex ?? undefined,
      deleteIllustration: false,
      ...buildDefaultValues(article),
      ...(state?.state === 'initial' ? {} : state.fields),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'segments',
  })

  const selectedArticleType = watch(
    'articleType',
    article ? toArticleTypeEnum(article.articleType) : ArticleTypeEnum.Default
  )
  const localStorageKey = useMemo(
    () => `article:form:${article?.id}`,
    [article?.id]
  )

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedArticleType === ArticleTypeEnum.Education) {
        return (
          item.segmentType === 'quiz_question' || item.segmentType === 'text'
        )
      }
      return item.segmentType !== 'quiz_question'
    })
  }, [selectedArticleType])

  useEffect(() => {
    if (!isEmpty(errors)) {
      Sentry.captureMessage('There were errors in the article form.', {
        level: 'warning',
        extra: {
          errors,
        },
      })
    }
  }, [errors])

  useEffect(() => {
    if (!article) {
      return
    }

    const value = localStorage.getItem(localStorageKey)

    const values: LocalStorageRecord = value?.length ? JSON.parse(value) : {}

    if (values.perex) {
      setValue('perex', values.perex, { shouldDirty: true })
    }
  }, [article, localStorageKey, setValue])

  useEffect(() => {
    if (!article) {
      return
    }

    if (state.state === 'success') {
      localStorage.removeItem(localStorageKey)

      reset({}, { keepValues: true })
    }
  }, [article, state, localStorageKey, reset])

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form
      action={formAction}
      onSubmit={handleSubmitForm}
      encType="multipart/form-data"
    >
      <input type="hidden" {...register('deleteIllustration')} />
      <AdminFormHeader>
        <AdminPageTitle title={props.title} description={props.description} />

        <AdminFormActions>
          {article?.id && <AdminArticlePreviewButton article={article} icon />}
          <LinkButton href="/beta/admin/articles">Zpět</LinkButton>

          <SubmitButton />
        </AdminFormActions>
      </AdminFormHeader>

      <AdminFormContent>
        <AdminFormMain className="col-span-12 lg:col-span-9 gap-y-5 grid grid-cols-1">
          <ErrorMessage message={errors.illustration?.message} />

          <Field>
            <Label htmlFor="title">Název článku</Label>

            <Input
              id="title"
              placeholder="Upravit název…"
              {...register('title', { required: true })}
            />

            <ErrorMessage message={errors.title?.message} />
          </Field>

          {selectedArticleType === ArticleTypeEnum.FacebookFactcheck && (
            <Field>
              <Label htmlFor="titleEn">Anglický název článku</Label>

              <Input
                id="titleEn"
                placeholder="Upravit anglický název…"
                {...register('titleEn', { required: true })}
              />

              <Controller
                control={control}
                name={'titleEn'}
                render={({ fieldState }) => (
                  <ErrorMessage message={fieldState.error?.message} />
                )}
              />
            </Field>
          )}

          <Field>
            <Label htmlFor="illustration">Ilustrační obrázek</Label>

            <AdminArticleIllustrationInput
              article={article}
              control={control}
              onDeleteImage={() => setValue('deleteIllustration', true)}
              name="illustration"
            />

            <ErrorMessage message={errors.illustration?.message} />
          </Field>

          <Field>
            <Label htmlFor="illustrationCaption" isOptional>
              Popisek obrázku
            </Label>

            <Input
              id="illustrationCaption"
              placeholder="Zadejte popisek obrázku..."
              {...register('illustrationCaption')}
            />

            <ErrorMessage message={errors.illustrationCaption?.message} />
          </Field>

          <Field>
            <Label htmlFor="perex" isDirty={isPerexDirty}>
              Perex
            </Label>
            <Textarea
              id="perex"
              {...register('perex', {
                required: true,
                onChange(evt) {
                  if (!article) {
                    return
                  }

                  localStorage.setItem(
                    localStorageKey,
                    buildLocalStorageRecord(localStorageKey, {
                      perex: evt.target.value,
                    })
                  )
                },
              })}
              rows={4}
              placeholder="Zadejte perex..."
            />

            <ErrorMessage message={errors.perex?.message} />
          </Field>

          <AdminSegmentSelector
            segments={filteredItems.map((item) => ({
              ...item,
              onClick: () => {
                if (item.segmentType === 'text') {
                  append({ segmentType: item.segmentType, textHtml: '' })
                }
                if (item.segmentType === 'source_statements') {
                  append({ segmentType: item.segmentType, sourceId: '' })
                }
                if (item.segmentType === 'quiz_question') {
                  append({ segmentType: item.segmentType, quizQuestionId: '' })
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
                    render={({ field, fieldState: { isDirty } }) => (
                      <>
                        <Label htmlFor={field.name} isDirty={isDirty}></Label>
                        <input
                          type="hidden"
                          name={field.name}
                          value={field.value}
                        />
                        <RichTextEditor
                          includeHeadings
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                        />
                      </>
                    )}
                  />

                  <Button onClick={() => remove(index)}>Odebrat</Button>
                </>
              ) : field.segmentType === 'source_statements' ? (
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
                />
              ) : field.segmentType === 'quiz_question' ? (
                <Controller
                  control={control}
                  name={`segments.${index}.quizQuestionId`}
                  render={({ field }) => (
                    <>
                      <input type="hidden" {...field} />
                      <AdminQuizQuestionList
                        selectedQuizQuestionId={field.value}
                        onRemoveSegment={() => remove(index)}
                        onChange={(quizQuestionId) =>
                          field.onChange(quizQuestionId)
                        }
                      />
                    </>
                  )}
                />
              ) : null}
            </div>
          ))}

          <Field>
            <Controller
              control={control}
              name="articleTags"
              render={({ field }) => (
                <Listbox multiple name={field.name} onChange={field.onChange}>
                  <Label htmlFor="articleTag">Tagy článku</Label>
                  <div className="relative mt-2">
                    <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <span className="block truncate">
                        {(field.value?.length ?? 0) === 0
                          ? 'Vyberte jeden nebo více tagů'
                          : field.value
                              ?.map(
                                (value) =>
                                  data.articleTags.find(
                                    (tag) => tag.id === value
                                  )?.title
                              )
                              .join(', ')}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-gray-400"
                        />
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                    >
                      {data.articleTags.map((person) => (
                        <ListboxOption
                          key={person.id}
                          value={person.id}
                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                        >
                          <span className="block truncate font-normal group-data-[selected]:font-semibold">
                            {person.title}
                          </span>

                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                            <CheckIcon aria-hidden="true" className="h-5 w-5" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              )}
            />
          </Field>
        </AdminFormMain>

        <AdminFormSidebar>
          <Fieldset className="space-y-5 w-full border-b border-gray-900/10 pb-8">
            <Field>
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
            </Field>

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

            <Field>
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

              <Controller
                control={control}
                name="articleVeracity"
                render={({ fieldState: { error } }) => (
                  <ErrorMessage message={error?.message} />
                )}
              />
            </Field>
            {article?.articleType === 'facebook_factcheck' && (
              <SecondaryLinkButton
                href={`/beta/admin/articles/${article?.id}/integrations`}
                icon={<GlobeAltIcon />}
                className="justify-center w-fit lg:w-full"
              >
                Integrace
              </SecondaryLinkButton>
            )}
          </Fieldset>
        </AdminFormSidebar>
      </AdminFormContent>
    </form>
  )
}
