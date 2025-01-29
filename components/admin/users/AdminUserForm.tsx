'use client'

import { Field, Select } from '@headlessui/react'
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
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { userSchema } from '@/libs/users/user-schema'
import { AdminUserRoleSelect } from './AdminUserRoleControl'
import { Switch } from '../forms/Switch'
import { SwitchField } from '../forms/SwitchField'
import { Textarea } from '../forms/Textarea'
import { AdminImageInput } from '../images/AdminImageInput'

const AdminUserFormFieldsDataFragment = gql(`
  fragment AdminUserFormFieldsData on Query {
    ...AdminUserRoleSelect
  }
`)

export function AdminUserForm(props: {
  title: string
  action: FormAction
  data: FragmentType<typeof AdminUserFormFieldsDataFragment>
}) {
  const data = useFragment(AdminUserFormFieldsDataFragment, props.data)

  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    control,
    register,
    trigger,
    formState: { isValid, errors },
  } = useForm<z.output<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ...(state?.state === 'initial' ? {} : state.fields),
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <>
      <form action={formAction} onSubmit={handleSubmitForm}>
        <div className="container">
          <AdminFormHeader>
            <AdminPageTitle title={props.title} />
            <AdminFormActions>
              <LinkButton href="/beta/admin/users">Zpět</LinkButton>
              <SubmitButton />
            </AdminFormActions>
          </AdminFormHeader>

          <div>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Field>
                      <Label htmlFor="firstName">Jméno</Label>
                      <Input
                        id="firstName"
                        placeholder="Zadejte jméno"
                        {...register('firstName', { required: true })}
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-3">
                    <Field>
                      <Label htmlFor="lastName">Příjmení</Label>
                      <Input
                        id="lastName"
                        placeholder="Zadejte příjmení"
                        {...register('lastName', { required: true })}
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-3">
                    <Field>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="Zadejte email"
                        {...register('email', { required: true })}
                      />
                      <p className="mt-1 text-sm/6 text-gray-600">
                        Uživatel musí mít Google účet s tímto emailem, aby se
                        dokázal do administrace přihlásit
                      </p>
                    </Field>
                  </div>

                  <div className="sm:col-span-3 sm:col-start-1">
                    <Field>
                      <Label htmlFor="roleId">Přístupová práva</Label>

                      <AdminUserRoleSelect
                        id="roleId"
                        control={control}
                        name="roleId"
                        data={data}
                      />

                      <ErrorMessage message={errors.roleId?.message} />
                    </Field>
                  </div>
                  <div className="sm:col-span-3 sm:col-start-1 flex items-center gap-2">
                    <Controller
                      name="emailNotifications"
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
                      htmlFor="emailNotifications"
                      label="Posílat upozornění emailem?"
                    />
                  </div>
                  <div className="sm:col-span-3 sm:col-start-1 flex items-center gap-2">
                    <Controller
                      name="userPublic"
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
                      htmlFor="userPublic"
                      label="Zobrazit uživatele v sekci O nás?"
                    />
                  </div>
                  {/*
                 <div className="sm:col-span-3 sm:col-start-1 flex items-center gap-2">
                    <div className="col-span-12 grow gap-y-5 grid grid-cols-1">
                      <Label htmlFor="avatar">
                        Vybrat obrázek
                        <span className="ml-3 text-sm/6 text-gray-600">
                          nepovinné
                        </span>
                      </Label>

                      <AdminImageInput control={control} name="avatar" />
                    </div>
                  </div>
                 */}
                  <div className="col-span-full">
                    <Field>
                      <Label htmlFor="positionDescription">
                        Popis pozice
                        <span className="ml-3 text-sm/6 text-gray-600">
                          nepovinné
                        </span>
                      </Label>

                      <Input
                        id="positionDescription"
                        placeholder="Popis pozice"
                        {...register('positionDescription', {
                          required: false,
                        })}
                      />
                    </Field>
                  </div>
                  <div className="col-span-full">
                    <Field>
                      <Label htmlFor="bio">
                        Bio
                        <span className="ml-3 text-sm/6 text-gray-600">
                          nepovinné
                        </span>
                      </Label>
                      <Textarea
                        id="bio"
                        placeholder="Napište něco o sobě"
                        {...register('bio', { required: false })}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
