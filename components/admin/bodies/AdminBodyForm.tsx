'use client'

import { Field, Fieldset, Legend } from '@headlessui/react'
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
import { schema } from '@/libs/bodies/schema'
import { dateInputFormat } from '@/libs/date-time'
import { AdminFormContent } from '../layout/AdminFormContent'
import { AdminImageInput } from '../images/AdminImageInput'

const AdminBodyDataFragment = gql(`
  fragment AdminBodyData on Body {
    name
    shortName
    isParty
    link
    logo
    foundedAt
    isInactive
    terminatedAt
  }
`)

type FieldValues = z.output<typeof schema>

export function AdminBodyForm(props: {
  title: string
  action: FormAction
  body?: FragmentType<typeof AdminBodyDataFragment>
}) {
  const body = useFragment(AdminBodyDataFragment, props.body)
  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    control,
    register,
    trigger,
    formState: { isValid, errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: body?.name ?? '',
      shortName: body?.shortName ?? '',
      isParty: body?.isParty ?? false,
      link: body?.link ?? '',
      logo: body?.logo ?? '',
      foundedAt: body?.foundedAt ? dateInputFormat(body.foundedAt) : '',
      isInactive: body?.isInactive ?? false,
      terminatedAt: body?.terminatedAt
        ? dateInputFormat(body.terminatedAt)
        : '',
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <>
      <form action={formAction} onSubmit={handleSubmitForm}>
        <AdminFormHeader>
          <AdminPageTitle title={props.title} />
          <AdminFormActions>
            <LinkButton href="/beta/admin/bodies">Zpět</LinkButton>
            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormContent>
          <div className="col-span-12 gap-y-5">
            <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
              <Legend className="text-base font-semibold leading-7 text-gray-900">
                Základní údaje
              </Legend>

              <Field>
                <Label htmlFor="name">Název</Label>
                <Input
                  id="name"
                  placeholder="Zadejte název"
                  {...register('name', { required: true })}
                />
                <ErrorMessage message={errors.name?.message} />
              </Field>
              <Field>
                <Label htmlFor="shortName" isOptional>
                  Zkrácený název
                </Label>
                <Input id="shortName" {...register('shortName')} />
              </Field>
              <Field>
                <div className="sm:col-span-3 sm:col-start-1 flex items-center gap-2">
                  <Controller
                    name="isParty"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.value}
                        disabled={field.disabled}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <SwitchField
                    htmlFor="isParty"
                    label="Jde o politickou stranu"
                  />
                </div>
              </Field>
              <Field>
                <Label htmlFor="link" isOptional>
                  Respekovaný odkaz obsahující popis (wikipedia, nasipolitici,
                  atp.)
                </Label>
                <Input id="link" {...register('link')} />
              </Field>
              <Field>
                <AdminImageInput
                  control={control}
                  name="logo"
                  required={false}
                  labelName="Vybrat logo"
                />
              </Field>
            </Fieldset>
            <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
              <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                Vznik a zánik
              </Legend>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Field className="w-full">
                  <Label htmlFor="foundedAt" isOptional>
                    Datum vzniku
                  </Label>
                  <Input
                    id="foundedAt"
                    type="date"
                    className="w-full"
                    {...register('foundedAt')}
                  />
                </Field>
                <Field className="w-full">
                  <Label htmlFor="terminatedAt" isOptional>
                    Datum zániku
                  </Label>
                  <Input
                    id="terminatedAt"
                    type="date"
                    className="w-full"
                    {...register('terminatedAt')}
                  />
                </Field>
              </div>
              <Field>
                <div className="flex items-center gap-2">
                  <Controller
                    name="isInactive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.value}
                        disabled={field.disabled}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <SwitchField
                    htmlFor="isInactive"
                    label="Skupina zanikla / není aktivní"
                  />
                </div>
              </Field>
            </Fieldset>
          </div>
        </AdminFormContent>
      </form>
    </>
  )
}
