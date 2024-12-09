'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { isValid, z } from 'zod'
import { LinkButton } from '../forms/LinkButton'
import { SubmitButton } from '../forms/SubmitButton'
import { contentImageSchema } from '@/libs/images/schema'
import { AdminImageInput } from '@/components/admin/images/AdminImageInput'
import { AdminFormHeader } from '../layout/AdminFormHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { AdminFormContent } from '../layout/AdminFormContent'
import { AdminFormActions } from '../layout/AdminFormActions'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { FormState } from '@/libs/forms/form-state'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'

export function AdminImageForm(props: {
  title: string
  description?: string
  action(prevState: FormState, input: FormData): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  const {
    control,
    trigger,
    formState: { errors, isValid },
  } = useForm<z.output<typeof contentImageSchema>>({
    resolver: zodResolver(contentImageSchema),
    defaultValues: {},
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={props.title} description={props.description} />
          <AdminFormActions>
            <LinkButton href="/beta/admin/images">Zpět</LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormContent>
          <div className="grow gap-y-5 grid grid-cols-1">
            {errors.image && <ErrorMessage message={errors.image.message} />}

            <AdminImageInput control={control} name="image" />
          </div>
        </AdminFormContent>
      </div>
    </form>
  )
}
