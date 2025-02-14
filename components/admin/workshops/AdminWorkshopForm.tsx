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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { workshopSchema } from '@/libs/workshops/workshop-schema'
import { AdminFormContent } from '../layout/AdminFormContent'
import { Field, Fieldset, Textarea } from '@headlessui/react'
import { FragmentType, gql, useFragment } from '@/__generated__'

const AdminWorkshopDataFragment = gql(`
    fragment AdminWorkshopData on Workshop {
      name
      description
      price
    }
  `)

type FieldValues = z.output<typeof workshopSchema>

export function AdminWorkshopForm(props: {
  action: FormAction
  title: string
  description?: string
  workshop?: FragmentType<typeof AdminWorkshopDataFragment>
}) {
  const workshop = useFragment(AdminWorkshopDataFragment, props.workshop)
  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    register,
    trigger,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: workshop?.name ?? '',
      description: workshop?.description ?? '',
      price: Number(workshop?.price) ?? '',
      ...(state.state === 'initial' ? {} : state.fields),
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminPageHeader>
        <AdminPageTitle title={props.title} description={props.description} />
        <AdminFormActions>
          <LinkButton
            href={`/beta/admin/workshops`}
            className="btn h-50px fs-6 s-back-link"
          >
            Zpět
          </LinkButton>
          <SubmitButton />
        </AdminFormActions>
      </AdminPageHeader>
      <AdminFormContent>
        <div className="col-span-12">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Field>
              <Label htmlFor="name">Název workshopu</Label>

              <Input
                id="name"
                placeholder="Zadejte název…"
                hasError={!!errors?.name}
                {...register('name', { required: true })}
              />

              <ErrorMessage message={errors.name?.message} />
            </Field>

            <Field>
              <Label htmlFor="description">Popis</Label>
              <Textarea
                className="w-full sm:text-sm text-gray-900 rounded-md shadow-sm w-full border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                id="description"
                {...register('description', { required: true })}
              />
              <ErrorMessage message={errors.description?.message} />
            </Field>
            <div className="grid grid-cols-12 ">
              <Field className="col-span-3">
                <Label htmlFor="price">Cena</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { required: true })}
                />
                <ErrorMessage message={errors.price?.message} />
              </Field>
            </div>
          </Fieldset>
        </div>
      </AdminFormContent>
    </form>
  )
}
