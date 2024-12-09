'use client'

import { Input } from '../forms/Input'
import { SubmitButton } from '../forms/SubmitButton'
import { LinkButton } from '../forms/LinkButton'
import { AdminFormActions } from '../layout/AdminFormActions'
import { AdminPageHeader } from '../layout/AdminPageHeader'
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
import { useFormSubmitV2 } from '@/libs/forms/hooks/form-submit-hook'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'

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
    defaultValues: {},
  })

  useFormToasts(state)

  const { handleSubmitForm } = useFormSubmitV2(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminPageHeader>
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
      </AdminPageHeader>

      <Label htmlFor="new-media-field">Název pořadu</Label>
      <Input
        id="new-media-field"
        hasError={!!errors.name}
        {...register('name', { required: true })}
      />
      <ErrorMessage message={errors.name?.message} />
    </form>
  )
}
