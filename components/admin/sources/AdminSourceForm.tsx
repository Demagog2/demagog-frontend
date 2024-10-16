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
import { Field, Fieldset } from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'
import { Input } from '@/components/admin/forms/Input'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'

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
    <form onSubmit={handleSubmitForm}>
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

            <Field>
              <Label htmlFor="sourceUrl">URL zdroje diskuze</Label>

              <Input
                id="sourceUrl"
                placeholder="https://example.com"
                type="url"
                hasError={!!errors?.sourceUrl}
                {...register('sourceUrl')}
              />

              <ErrorMessage message={errors.sourceUrl?.message} />
            </Field>
          </Fieldset>
        </AdminFormContent>
      </div>
    </form>
  )
}
