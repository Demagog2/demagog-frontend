'use client'

import { FormState } from '@/app/(admin)/admin/tags/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LinkButton } from '../forms/LinkButton'
import { SubmitButton } from '../forms/SubmitButton'
import { contentImageSchema } from '@/libs/images/schema'
import { AdminImageInput } from '@/components/admin/images/AdminImageInput'
import { AdminFormHeader } from '../layout/AdminFormHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { AdminFormActions } from '../layout/AdminFormActions'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'

export function AdminImageForm(props: {
  title: string
  description?: string
  action(prevState: FormState, input: FormData): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { message: '' })

  const { control, handleSubmit } = useForm<
    z.output<typeof contentImageSchema>
  >({
    resolver: zodResolver(contentImageSchema),
    defaultValues: {},
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmitForm } = useFormSubmit<
    z.output<typeof contentImageSchema>
  >(handleSubmit, formAction, formRef)

  return (
    <form ref={formRef} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={props.title} description={props.description} />
          <AdminFormActions>
            <LinkButton href="/admin/images">Zpět</LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>

        <div className="mt-6 flex gap-5 pb-12">
          <div className="grow gap-y-5 grid grid-cols-1">
            {state.error && <div className="text-red">{state.error}</div>}

            <AdminImageInput control={control} name="image" />
          </div>
        </div>
      </div>
    </form>
  )
}
