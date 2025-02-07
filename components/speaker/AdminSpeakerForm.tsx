'use client'

import { Field } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Label } from '../forms/Label'
import { Input } from '../forms/Input'
import { LinkButton } from '../forms/LinkButton'
import { SubmitButton } from '../forms/SubmitButton'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminFormHeader } from '../layout/AdminFormHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { AdminFormActions } from '../layout/AdminFormActions'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { FormAction } from '@/libs/forms/form-action'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { Switch } from '../forms/Switch'
import { SwitchField } from '../forms/SwitchField'
import { Textarea } from '../forms/Textarea'
import { speakerSchema } from '@/libs/speakers/speaker-schema'

type FieldValues = z.output<typeof speakerSchema>

export function AdminSpeakerForm(props: { title: string; action: FormAction }) {
  const [state, formAction] = useFormState(props.action, { state: 'initial' })
  useFormToasts(state)

  const {
    control,
    register,
    trigger,
    formState: { isValid, errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(speakerSchema),
    defaultValues: {},
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <>
      <form action={formAction} onSubmit={handleSubmitForm}>
        <div className="container">
          <AdminFormHeader>
            <AdminPageTitle title={props.title} />
            <AdminFormActions>
              <LinkButton href="/beta/admin/speakers">Zpět</LinkButton>
              <SubmitButton />
            </AdminFormActions>
          </AdminFormHeader>
        </div>
      </form>
    </>
  )
}
