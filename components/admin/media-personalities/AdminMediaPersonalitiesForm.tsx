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
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mediaPersonalitySchema } from '@/libs/media-personality/media-personality-schema'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { AdminFormContent } from '../layout/AdminFormContent'
import { Field, Fieldset } from '@headlessui/react'
import { AdminFormHeader } from '../layout/AdminFormHeader'

export default function AdminMediaPersonalitiesForm(props: {
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
  } = useForm<z.output<typeof mediaPersonalitySchema>>({
    resolver: zodResolver(mediaPersonalitySchema),
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
            href={`/beta/admin/moderators`}
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
            <Label htmlFor="new-moderator-name">Jméno</Label>
            <Input
              id="new-moderator-name"
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
