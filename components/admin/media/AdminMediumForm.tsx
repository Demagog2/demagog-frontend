'use client'

import { Input } from '../forms/Input'
import { SubmitButton } from '../forms/SubmitButton'
import { LinkButton } from '../forms/LinkButton'
import { AdminFormActions } from '../layout/AdminFormActions'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { Label } from '../forms/Label'
import { FormAction } from '@/libs/forms/form-action'
import { useFormState } from 'react-dom'
import type { FormState } from '@/libs/forms/form-state'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { mediumSchema } from '@/libs/media/medium-schema'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { AdminFormHeader } from '../layout/AdminFormHeader'
import { AdminFormContent } from '../layout/AdminFormContent'
import { Field, Fieldset } from '@headlessui/react'

export default function AdminMediumForm(props: {
  action: FormAction
  name?: string
  title: string
}) {
  const [state, formAction] = useFormState<FormState>(props.action, {
    state: 'initial',
  })

  const {
    trigger,
    register,
    formState: { errors, isValid },
  } = useForm<z.output<typeof mediumSchema>>({
    resolver: zodResolver(mediumSchema),
    defaultValues: {
      name: props.name ?? '',
    },
  })

  useFormToasts(state)

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminFormHeader>
        <AdminPageTitle title={props.title} />
        <AdminFormActions>
          <LinkButton
            href={`/beta/admin/media`}
            className="btn h-50px fs-6 s-back-link"
          >
            Zpět
          </LinkButton>
          <SubmitButton />
        </AdminFormActions>
      </AdminFormHeader>

      <AdminFormContent>
        <Fieldset className="col-span-12">
          <Field>
            <Label htmlFor="new-media-field">Název pořadu</Label>
            <Input
              id="new-media-field"
              hasError={!!errors.name}
              {...register('name', { required: true })}
            />
            <ErrorMessage message={errors.name?.message} />
          </Field>
        </Fieldset>
      </AdminFormContent>
    </form>
  )
}
