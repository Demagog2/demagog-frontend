'use client'

import { FormState } from '@/app/(admin)/admin/tags/actions'
import { schema } from '@/libs/tags/schema'
import { Field, Select } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
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
import { AdminFormActions } from '../layout/AdminFormActions'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'

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
  action(prevState: FormState, input: FormData): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { message: '' })
  const tag = useFragment(AdminTagFormFieldsFragment, props.tag)

  const { register, handleSubmit } = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      forStatementType: 'factual',
      ...(tag ? tag : {}),
      ...(state.fields ?? {}),
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmitForm } = useFormSubmit<z.output<typeof schema>>(
    handleSubmit,
    formAction,
    formRef
  )

  return (
    <form ref={formRef} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={props.title} />
          <AdminFormActions>
            <LinkButton href="/admin/tags">Zpět</LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>
        <div className="mt-6 flex gap-5 pb-12">
          <div className="grow gap-y-5 grid grid-cols-1">
            {state.error && <div className="text-red">{state.error}</div>}

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
        </div>
      </div>
    </form>
  )
}
