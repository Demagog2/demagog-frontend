'use client'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { Label } from '../../../admin/forms/Label'
import { Input } from '../../../admin/forms/Input'
import { euroclimateFormSchema } from '@/libs/integrations/Euro-climate-schema'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import {
  topic,
  distortionType,
  formatType,
} from '@/libs/integrations/Euro-climate-schema'
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

const AdminEuroClimateFormDataFragment = gql(`
    fragment AdminEuroClimateFormData on EuroClimateIntegration {
      topic
      subtopics
      appearanceDate
      appearanceUrl
      archiveUrl
      format
    }
  `)

type FieldValues = z.output<typeof euroclimateFormSchema>

export function AdminEuroClimateForm(props: {
  action: FormAction
  articleId: string
  data?: FragmentType<typeof AdminEuroClimateFormDataFragment>
}) {
  const data = useFragment(AdminEuroClimateFormDataFragment, props.data)
  const [state, formAction] = useFormState(props.action, { state: 'initial' })
  const [isFormVisible, setIsFormVisible] = useState(false)

  useFormToasts(state)

  const {
    register,
    control,
    watch,
    trigger,
    formState: { isValid, errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(euroclimateFormSchema),
    defaultValues: {
      articleId: props.articleId,
      topic: data?.topic ?? '',
      subtopics: data?.subtopics ?? [],
      // distortionType: [],
      appearance: {
        appearanceUrl: data?.appearanceUrl ?? '',
        appearanceDate: data?.appearanceDate ?? '',
        archiveUrl: data?.archiveUrl ?? '',
        format: data?.format ?? '',
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
              Skrýt formulář
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-5 w-5 mr-1" />
              Zobrazit formulář
            </>
          )}
        </button>
      </div>

      {isFormVisible && (
        <form action={formAction} onSubmit={handleSubmitForm}>
          <input type="hidden" {...register('articleId')} />

          <div className="w-full border-t border-gray-900/10 mt-6">
            <div className="flex justify-end mt-6">
              <SubmitButton />
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
                          <Select
                            id="topic"
                            items={Object.entries(topic).map(
                              ([id, topicData]) => ({
                                label: topicData.label,
                                value: id,
                              })
                            )}
                            placeholder="Vyberte téma"
                            onChange={(item) => field.onChange(item?.value)}
                            defaultValue={field.value}
                            canRemoveItem
                          />
                        )}
                      />
                      <ErrorMessage message={errors.topic?.message} />
                    </Field>

                    <Field>
                      <Label htmlFor="subtopics">Podtéma</Label>

                      <Multiselect
                        control={control}
                        items={
                          selectedTopic
                            ? topic[
                                selectedTopic as keyof typeof topic
                              ].subtopics.map((item) => ({
                                label: item.label,
                                value: item.id,
                              }))
                            : []
                        }
                        name="subtopics"
                        placeholder="Vyberte podtémata"
                      />
                    </Field>
                  </div>
                </Fieldset>
                {/* <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
                  <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                    Podrobnosti o tvrzení
                  </Legend>
                  <Field>
                    <Label htmlFor="disctortionType">Typ dezinformace</Label>
                    <Multiselect
                      control={control}
                      items={distortionType}
                      name="distortionType"
                      placeholder="Vyberte typ dezinformace"
                    />
                  </Field>
                </Fieldset> */}
                <Fieldset className="space-y-4 col-span-8 border-b border-gray-900/10 pb-8 px-6">
                  <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                    Výskyt tvrzení
                  </Legend>

                  <Field>
                    <Label htmlFor="appearanceUrl">URL výskytu tvrzení</Label>
                    <Input
                      type="text"
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
                    </Field>
                    <Field>
                      <Label htmlFor="format">Formát šíření</Label>
                      <Controller
                        control={control}
                        name="appearance.format"
                        render={({ field }) => (
                          <Select
                            id="format"
                            items={formatType}
                            placeholder="Vyberte formát"
                            onChange={(item) => field.onChange(item?.value)}
                            defaultValue={field.value}
                            canRemoveItem
                          />
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
                      type="text"
                      id="archiveUrl"
                      placeholder="Zadejte archivní URL"
                      {...register('appearance.archiveUrl')}
                    />
                  </Field>
                </Fieldset>
              </div>
            </AdminFormContent>
          </div>
        </form>
      )}
    </>
  )
}
