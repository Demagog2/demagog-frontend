'use client'

import { schema } from '@/libs/tags/schema'
import { Field, Select } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Label } from '../forms/Label'
import { Input } from '../forms/Input'
import { LinkButton } from '../forms/LinkButton'
import { SubmitButton } from '../forms/SubmitButton'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminFormHeader } from '../layout/AdminFormHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { AdminFormContent } from '../layout/AdminFormContent'
import { AdminFormActions } from '../layout/AdminFormActions'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { FormAction } from '@/libs/forms/form-action'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'

const AdminTagFormFieldsFragment = gql(`
  fragment AdminTagFormFields on Tag {
    name
    forStatementType
  }
`)

export function AdminTagForm(props: {
  title: string
  description?: string
  tag?: FragmentType<typeof AdminTagFormFieldsFragment>
  action: FormAction
}) {
  const [state, formAction] = useFormState(props.action, { state: 'initial' })
  const tag = useFragment(AdminTagFormFieldsFragment, props.tag)

  useFormToasts(state)

  const {
    register,
    trigger,
    formState: { isValid, errors },
  } = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      forStatementType: 'factual',
      ...(tag ? tag : {}),
      ...(state.state === 'initial' ? {} : state.fields),
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={props.title} />
          <AdminFormActions>
            <LinkButton href="/beta/admin/tags">Zpět</LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormContent>
          <div className="col-span-12 grow gap-y-5 grid grid-cols-1">
            {errors.name && <ErrorMessage message={errors.name?.message} />}

            <Field>
              <Label htmlFor="title">Název štítku</Label>

              <Input
                id="title"
                placeholder="Upravit název…"
                {...register('name', { required: true })}
              />
            </Field>

            <Field>
              <Label htmlFor="forStatementType">Pro výroky typu</Label>

              <Select
                id="forStatementType"
                aria-label="Pro výroky typu"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register('forStatementType', { required: true })}
              >
                <option value="factual">Faktické výroky</option>
                <option value="promise">Sliby politků</option>
                <option value="newyears">Novoroční</option>
              </Select>
            </Field>
          </div>
        </AdminFormContent>
      </div>
    </form>
  )
}
