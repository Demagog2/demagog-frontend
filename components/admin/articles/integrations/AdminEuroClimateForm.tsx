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
  distortionTypes,
  formatTypes,
} from '@/libs/integrations/Euro-climate-schema'
import { Multiselect } from '../../forms/Multiselect'
import { Select } from '../../forms/Select'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { SubmitButton } from '../../forms/SubmitButton'

type FieldValues = z.output<typeof euroclimateFormSchema>

export function AdminEuroClimateForm() {
  const {
    register,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: zodResolver(euroclimateFormSchema),
    defaultValues: {
      topic: undefined,
      subtopic: [],
      distortionType: [],
      appearanceUrl: '',
      appearanceDate: '',
      archiveUrl: '',
      format: undefined,
    },
  })

  const selectedTopic = watch('topic')

  return (
    <div className="w-full border-t border-gray-900/10 mt-6">
      <div className="flex justify-end mt-6">
        <SubmitButton />
      </div>
      <AdminFormContent>
        <div className="col-span-12 gap-y-5">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className=" text-base font-semibold leading-7 text-gray-900">
              Detaily článku
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
                      items={Object.entries(topic).map(([id, topicData]) => ({
                        label: topicData.label,
                        value: id,
                      }))}
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
                <Label htmlFor="subtopic">Podtéma</Label>

                <Multiselect
                  control={control}
                  items={
                    selectedTopic
                      ? topic[selectedTopic as keyof typeof topic].subtopic.map(
                          (item) => ({
                            label: item.label,
                            value: item.id,
                          })
                        )
                      : []
                  }
                  name="subtopic"
                  placeholder="Vyberte podtémata"
                />
              </Field>
            </div>
            <Field>
              <Label htmlFor="disctortionType">Typ dezinformace</Label>
              <Multiselect
                control={control}
                items={distortionTypes}
                name="distortionType"
                placeholder="Vyberte typ dezinformace"
              />
            </Field>
          </Fieldset>
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
              Podrobnosti o tvrzení
            </Legend>
            <Field>
              <Label htmlFor="appearanceUrl">URL výskytu tvrzení</Label>
              <Input
                type="text"
                id="appearanceUrl"
                placeholder="Zadejte URL"
                {...register('appearanceUrl', { required: true })}
              />
              <ErrorMessage message={errors.appearanceUrl?.message} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="appearanceDate">Datum výskytu</Label>
                <Input type="date" {...register('appearanceDate')} />
              </Field>
              <Field>
                <Label htmlFor="format">Formát</Label>
                <Controller
                  control={control}
                  name="format"
                  render={({ field }) => (
                    <Select
                      id="format"
                      items={formatTypes}
                      placeholder="Vyberte formát"
                      onChange={(item) => field.onChange(item?.value)}
                      defaultValue={field.value}
                      canRemoveItem
                    />
                  )}
                />
                <ErrorMessage message={errors.format?.message} />
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
                {...register('archiveUrl')}
              />
            </Field>
          </Fieldset>
        </div>
      </AdminFormContent>
    </div>
  )
}
