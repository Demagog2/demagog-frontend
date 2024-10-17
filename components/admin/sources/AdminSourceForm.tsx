'use client'

import { AdminFormHeader } from '@/components/admin/layout/AdminFormHeader'

import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminFormActions } from '@/components/admin/layout/AdminFormActions'
import { AdminFormContent } from '@/components/admin/layout/AdminFormContent'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { SubmitButton } from '@/components/admin/forms/SubmitButton'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { sourceSchema } from '@/libs/sources/source-schema'
import { createSource } from '@/app/(admin)/admin/sources/actions'
import { Description, Field, Fieldset } from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'
import { Input } from '@/components/admin/forms/Input'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { Textarea } from '@/components/admin/forms/Textarea'
import { Select } from '@/components/admin/forms/Select'

const people = [
  { value: '1', name: 'Leslie Alexander 1' },
  { value: '2', name: 'Leslie Alexander 2' },
  { value: '3', name: 'Leslie Alexander 3' },
  { value: '4', name: 'Leslie Alexander 4' },
  { value: '5', name: 'Leslie Alexander 5' },
]

export function AdminSourceForm(props: {
  title: string
  description?: string
}) {
  const [state, formAction] = useFormState(createSource, { message: '' })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm<z.output<typeof sourceSchema>>({
    resolver: zodResolver(sourceSchema),
    defaultValues: { name: '', ...(state.fields ?? {}) },
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmitForm } = useFormSubmit<z.output<typeof sourceSchema>>(
    handleSubmit,
    formAction,
    formRef
  )

  return (
    <form ref={formRef} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={props.title} description={props.description} />

          <AdminFormActions>
            <LinkButton href="/admin/sources">Zpět</LinkButton>

            <SubmitButton isSubmitting={isSubmitting} />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormContent>
          <Fieldset className="space-y-4 w-full">
            <Field>
              <Label htmlFor="name">Název diskuze</Label>

              <Input
                id="name"
                placeholder="Upravit název…"
                hasError={!!errors?.name}
                {...register('name', { required: true })}
              />

              <ErrorMessage message={errors.name?.message} />
            </Field>

            <div className="columns-2">
              <Field>
                <Label htmlFor="mediumId" isOptional>
                  Pořad
                </Label>

                <Select name="mediumId" items={people} onChange={console.log} />
              </Field>

              <Field>
                <Label htmlFor="mediaPersonalityIds" isOptional>
                  Moderátoři
                </Label>

                <Select
                  name="mediaPersonalityIds"
                  items={people}
                  onChange={console.log}
                />
              </Field>
            </div>

            <Field>
              <Label htmlFor="sourceUrl" isOptional>
                URL zdroje diskuze
              </Label>

              <Input
                id="sourceUrl"
                placeholder="https://example.com"
                type="url"
                hasError={!!errors?.sourceUrl}
                {...register('sourceUrl')}
              />

              <ErrorMessage message={errors.sourceUrl?.message} />
            </Field>

            <Field>
              <Label isOptional htmlFor="transcript">
                Přepis
              </Label>

              <Description className="text-sm text-gray-500">
                Je-li dostupný, doporučujeme vyplnit, protože usnaďňuje
                vytváření výroků označováním v přepisu.
              </Description>

              <Textarea
                id="transcript"
                {...register('transcript')}
                rows={10}
                placeholder="Text přepisu diskuze..."
              />
            </Field>
          </Fieldset>
        </AdminFormContent>
      </div>
    </form>
  )
}
