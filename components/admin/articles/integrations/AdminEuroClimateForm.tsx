'use client'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { Label } from '../../../admin/forms/Label'
import { Input } from '../../../admin/forms/Input'
import {
  distortionType,
  euroclimateFormSchema,
} from '@/libs/integrations/Euro-climate-schema'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { topics, formatType } from '@/libs/integrations/Euro-climate-schema'
import { Multiselect } from '../../forms/Multiselect'
import { Select } from '../../forms/Select'
import { SubmitButton } from '../../forms/SubmitButton'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { FormAction } from '@/libs/forms/form-action'
import { useFormState } from 'react-dom'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { dateInputFormat } from '@/libs/date-time'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import classNames from 'classnames'
import { AlertMessage } from '../../layout/AlertMessage'

const AdminEuroClimateFormAuthorizationDataFragment = gql(`
    fragment AdminEuroClimateFormAuthorizationData on Query {
      ...Authorization
    }
  `)

const AdminEuroClimateFormArticleDataFragment = gql(`
    fragment AdminEuroClimateFormArticleData on EuroClimateIntegration {
      topic
      subtopics
      appearanceDate
      appearanceUrl
      archiveUrl
      format
      distortions
    }
  `)

type FieldValues = z.output<typeof euroclimateFormSchema>

export function AdminEuroClimateForm(props: {
  action: FormAction
  articleId: string
  articleData?: FragmentType<typeof AdminEuroClimateFormArticleDataFragment>
  data: FragmentType<typeof AdminEuroClimateFormAuthorizationDataFragment>
}) {
  const articleData = useFragment(
    AdminEuroClimateFormArticleDataFragment,
    props.articleData
  )
  const data = useFragment(
    AdminEuroClimateFormAuthorizationDataFragment,
    props.data
  )
  const [state, formAction] = useFormState(props.action, { state: 'initial' })
  const [isFormVisible, setIsFormVisible] = useState(false)

  const { isAuthorized } = useAuthorization(data)

  useFormToasts(state)

  const {
    register,
    control,
    watch,
    trigger,
    setValue,
    formState: { isValid, errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(euroclimateFormSchema),
    defaultValues: {
      articleId: props.articleId,
      topic: articleData?.topic,
      subtopics: articleData?.subtopics ?? [],
      distortions: articleData?.distortions ?? [],
      appearance: {
        appearanceUrl: articleData?.appearanceUrl ?? '',
        appearanceDate: articleData?.appearanceDate
          ? dateInputFormat(articleData.appearanceDate)
          : '',
        archiveUrl: articleData?.archiveUrl ?? '',
        format: articleData?.format,
      },
    },
  })

  const selectedTopic = watch('topic')

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <>
      <div className="flex justify-start mt-6">
        <button
          type="button"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? (
            <>
              <ChevronUpIcon className="h-5 w-5 mr-1" />
              Skrýt
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-5 w-5 mr-1" />
              Doplňující informace
            </>
          )}
        </button>
      </div>

      {isFormVisible && (
        <>
          {!isAuthorized(['articles:edit']) && (
            <AlertMessage
              title="Formulář je uzamčen"
              message="Pro zveřejňování článku do extermích systémů nemáte oprávnění. Kontaktujte administrátora."
              className="mt-3"
            />
          )}

          <form action={formAction} onSubmit={handleSubmitForm} noValidate>
            <input type="hidden" {...register('articleId')} />

            <div
              className={classNames(
                'w-full border-t border-gray-900/10 mt-6',
                !isAuthorized(['articles:edit']) &&
                  'opacity-50 pointer-events-none'
              )}
            >
              <div className="flex justify-end mt-6">
                <SubmitButton label="Uložit do EuroClimate" />
              </div>
              <AdminFormContent>
                <div className="col-span-12 gap-y-5">
                  <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
                    <Legend className=" text-base font-semibold leading-7 text-gray-900">
                      Podrobnosti o článku
                    </Legend>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field>
                        <Label htmlFor="topic">Téma</Label>
                        <Controller
                          control={control}
                          name="topic"
                          render={({ field }) => (
                            <>
                              <input type="hidden" {...field} />
                              <Select
                                id="topic"
                                items={Object.entries(topics).map(
                                  ([id, topicData]) => ({
                                    label: topicData.label,
                                    value: id,
                                  })
                                )}
                                placeholder="Vyberte téma"
                                onChange={(item) => {
                                  field.onChange(item?.value)
                                  setValue('subtopics', [])
                                }}
                                defaultValue={field.value}
                                canRemoveItem
                              />
                            </>
                          )}
                        />
                        <ErrorMessage message={errors.topic?.message} />
                      </Field>

                      <Field>
                        <Label htmlFor="subtopics">Podtéma</Label>

                        <Multiselect
                          name="subtopics"
                          control={control}
                          items={
                            selectedTopic
                              ? topics[
                                  selectedTopic as keyof typeof topics
                                ].subtopics.map((item) => ({
                                  label: item.label,
                                  value: item.id,
                                }))
                              : []
                          }
                          placeholder="Vyberte podtémata"
                        />
                        <ErrorMessage message={errors.subtopics?.message} />
                      </Field>
                    </div>
                  </Fieldset>
                  <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
                    <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                      Podrobnosti o tvrzení
                    </Legend>
                    <Field>
                      <Label htmlFor="disctortionType">Typ dezinformace</Label>
                      <Multiselect
                        control={control}
                        items={distortionType.map((item) => ({
                          label: item.label,
                          value: item.value,
                        }))}
                        name="distortions"
                        placeholder="Vyberte typ dezinformace"
                      />
                      <ErrorMessage message={errors.distortions?.message} />
                    </Field>
                  </Fieldset>
                  <Fieldset className="space-y-4 col-span-8 border-b border-gray-900/10 pb-8">
                    <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                      Výskyt tvrzení
                    </Legend>

                    <Field>
                      <Label htmlFor="appearanceUrl">URL výskytu tvrzení</Label>
                      <Input
                        type="url"
                        id="appearanceUrl"
                        placeholder="Zadejte URL"
                        {...register('appearance.appearanceUrl', {
                          required: true,
                        })}
                      />
                      <ErrorMessage
                        message={errors.appearance?.appearanceUrl?.message}
                      />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field>
                        <Label htmlFor="appearanceDate">Datum výskytu</Label>
                        <Input
                          type="date"
                          {...register('appearance.appearanceDate')}
                        />
                        <ErrorMessage
                          message={errors.appearance?.appearanceDate?.message}
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="format">Formát šíření</Label>
                        <Controller
                          control={control}
                          name="appearance.format"
                          render={({ field }) => (
                            <>
                              <input type="hidden" {...field} />
                              <Select
                                id="format"
                                items={formatType}
                                placeholder="Vyberte formát"
                                onChange={(item) => field.onChange(item?.value)}
                                defaultValue={field.value}
                                canRemoveItem
                              />
                            </>
                          )}
                        />
                        <ErrorMessage
                          message={errors.appearance?.format?.message}
                        />
                      </Field>
                    </div>

                    <Field>
                      <Label htmlFor="archiveUrl" isOptional>
                        Archivní URL
                      </Label>
                      <Input
                        type="url"
                        id="archiveUrl"
                        placeholder="Zadejte archivní URL"
                        {...register('appearance.archiveUrl')}
                      />
                      <ErrorMessage
                        message={errors.appearance?.archiveUrl?.message}
                      />
                    </Field>
                  </Fieldset>
                </div>
              </AdminFormContent>
            </div>
          </form>
        </>
      )}
    </>
  )
}
