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
import {
  ChevronUpIcon,
  PlusCircleIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { useFieldArray } from 'react-hook-form'
import { useState } from 'react'

type FieldValues = z.output<typeof euroclimateFormSchema>

export function AdminEuroClimateForm() {
  const [isFormVisible, setIsFormVisible] = useState(false)

  const {
    register,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: zodResolver(euroclimateFormSchema),
    defaultValues: {
      topic: undefined,
      subtopics: [],
      distortionType: [],
      appearances: [
        {
          appearanceUrl: '',
          appearanceDate: '',
          archiveUrl: '',
          format: 'other',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'appearances',
  })

  const selectedTopic = watch('topic')

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
              <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
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
              </Fieldset>

              {fields.map((field, index) => (
                <>
                  <Fieldset
                    key={field.id}
                    className="space-y-4 col-span-8 border-b border-gray-900/10 pb-8 px-6"
                  >
                    <div className="flex justify-between items-center">
                      <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                        Výskyt tvrzení #{index + 1}
                      </Legend>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-4 p-2 text-gray-400 hover:text-indigo-600"
                          title="Odstranit výskyt"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <Field>
                      <Label htmlFor={`appearanceUrl-${index}`}>
                        URL výskytu tvrzení
                      </Label>
                      <Input
                        type="text"
                        id={`appearanceUrl-${index}`}
                        placeholder="Zadejte URL"
                        {...register(`appearances.${index}.appearanceUrl`, {
                          required: true,
                        })}
                      />
                      <ErrorMessage
                        message={
                          errors.appearances?.[index]?.appearanceUrl?.message
                        }
                      />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field>
                        <Label htmlFor={`appearanceDate-${index}`}>
                          Datum výskytu
                        </Label>
                        <Input
                          type="date"
                          {...register(`appearances.${index}.appearanceDate`)}
                        />
                      </Field>
                      <Field>
                        <Label htmlFor={`format-${index}`}>Formát šíření</Label>
                        <Controller
                          control={control}
                          name={`appearances.${index}.format`}
                          render={({ field }) => (
                            <Select
                              id={`format-${index}`}
                              items={formatType}
                              placeholder="Vyberte formát"
                              onChange={(item) => field.onChange(item?.value)}
                              defaultValue={field.value}
                              canRemoveItem
                            />
                          )}
                        />
                        <ErrorMessage
                          message={errors.appearances?.[index]?.format?.message}
                        />
                      </Field>
                    </div>

                    <Field>
                      <Label htmlFor={`archiveUrl-${index}`} isOptional>
                        Archivní URL
                      </Label>
                      <Input
                        type="text"
                        id={`archiveUrl-${index}`}
                        placeholder="Zadejte archivní URL"
                        {...register(`appearances.${index}.archiveUrl`)}
                      />
                    </Field>
                  </Fieldset>
                </>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() =>
                    append({
                      appearanceUrl: '',
                      appearanceDate: '',
                      archiveUrl: '',
                      format: 'other',
                    })
                  }
                >
                  <PlusCircleIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  Přidat výskyt
                </button>
              </div>
            </div>
          </AdminFormContent>
        </div>
      )}
    </>
  )
}
