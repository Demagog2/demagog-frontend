'use client'

import { Field, Fieldset, Legend } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Label } from '../admin/forms/Label'
import { Input } from '../admin/forms/Input'
import { LinkButton } from '../admin/forms/LinkButton'
import { SubmitButton } from '../admin/forms/SubmitButton'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminFormHeader } from '../admin/layout/AdminFormHeader'
import { AdminPageTitle } from '../admin/layout/AdminPageTitle'
import { AdminFormActions } from '../admin/layout/AdminFormActions'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { FormAction } from '@/libs/forms/form-action'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { speakerSchema } from '@/libs/speakers/speaker-schema'
import { AdminFormContent } from '../admin/layout/AdminFormContent'
import { AdminBodySelect } from '../admin/sources/AdminBodySelect'
import { dateInputFormat } from '@/libs/date-time'
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline'

const AdminSpeakerFormFragment = gql(`
  fragment AdminSpeakerForm on Query {
    ...AdminBodySelect
  }
`)

const AdminSpeakerDataFragment = gql(`
  fragment AdminSpeakerData on Speaker {
    firstName
    lastName
    role
    wikidataId
    websiteUrl
    osobaId
    memberships {
      body {
        name
        id
      }
      id
      since
      until
    }
  }
`)

type FieldValues = z.output<typeof speakerSchema>

export function AdminSpeakerForm(props: {
  title: string
  action: FormAction
  data: FragmentType<typeof AdminSpeakerFormFragment>
  speaker?: FragmentType<typeof AdminSpeakerDataFragment>
}) {
  const data = useFragment(AdminSpeakerFormFragment, props.data)
  const speaker = useFragment(AdminSpeakerDataFragment, props.speaker)
  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    control,
    register,
    trigger,
    formState: { isValid, errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(speakerSchema),
    defaultValues: {
      firstName: speaker?.firstName ?? '',
      lastName: speaker?.lastName ?? '',
      role: speaker?.role ?? '',
      wikidataId: speaker?.wikidataId ?? '',
      websiteUrl: speaker?.websiteUrl ?? '',
      osobaId: speaker?.osobaId ?? '',
      memberships:
        speaker?.memberships?.map((membership) => ({
          id: membership.id,
          since: membership.since ? dateInputFormat(membership.since) : '',
          until: membership.until ?? '',
          body: membership.body.name ?? '',
          bodyId: membership.body.id,
        })) ?? [],
      ...(state?.state === 'initial' ? {} : state.fields),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'memberships',
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <>
      <form action={formAction} onSubmit={handleSubmitForm}>
        <div className="container mx-auto">
          <AdminFormHeader>
            <AdminPageTitle title={props.title} />
            <AdminFormActions>
              <LinkButton href="/beta/admin/speakers">Zpět</LinkButton>
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
                  <Label htmlFor="firstName">Jméno</Label>
                  <Input
                    id="firstName"
                    placeholder="Zadejte jméno"
                    {...register('firstName', { required: true })}
                  />
                  <ErrorMessage message={errors.firstName?.message} />
                </Field>
                <Field>
                  <Label htmlFor="lastName">Příjmení</Label>
                  <Input
                    id="lastName"
                    placeholder="Zadejte příjmení"
                    {...register('lastName', { required: true })}
                  />{' '}
                  <ErrorMessage message={errors.lastName?.message} />
                </Field>
              </Fieldset>
              <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
                <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                  Doplňující údaje
                </Legend>

                <Field>
                  <Label htmlFor="role" isOptional>
                    Funkce
                  </Label>
                  <Input
                    id="role"
                    placeholder="Zadejte funkci"
                    {...register('role')}
                  />
                  <p className="mt-1 text-sm/6 text-gray-600">
                    Současná funkce osoby, např. &quot;Předseda vlády ČR&qout;
                    nebo &quot;Ministryně práce a sociálních věcí&quot;. Pište s
                    velkým písmenem na začátku. Funkce by neměla být delší než
                    40 znaků.
                  </p>
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="wikidataId" isOptional>
                      Wikidata ID
                    </Label>
                    <Input id="wikidataId" {...register('wikidataId')} />
                    <p className="mt-1 text-sm/6 text-gray-600">
                      Používá se pro párování s jinými zdroji jako například
                      Hlídač státu, vyplňujte prosím. Wikidata ID získáte
                      najitím stránky politika na Wikipedii a kliknutím na
                      &quot;Položka Wikidat&qout; vlevo. Je to ten kód
                      začínající velkým Q a pokračující číslem, např. Q939539.
                    </p>
                  </Field>
                  <Field>
                    <Label htmlFor="osobaId" isOptional>
                      Hlídač státu OsobaID
                    </Label>
                    <Input id="osobaId" {...register('osobaId')} />
                    <p className="mt-1 text-sm/6 text-gray-600">
                      Dřív se OsobaID používalo pro párování s osobami na
                      Hlídači státu. Od října 2020 se graduálně posouváme k
                      párování přes Wikidata ID, tím pádem již toto pole není
                      třeba pro nové osoby vyplňovat.
                    </p>
                  </Field>
                </div>
                <Field>
                  <Label htmlFor="websiteUrl" isOptional>
                    Respektovaný odkaz (wiki, nasipolitici)
                  </Label>
                  <Input
                    id="websiteUrl"
                    placeholder="http://www..."
                    {...register('websiteUrl')}
                  />
                </Field>
              </Fieldset>
              <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
                <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
                  Příslušnost ke stranám/skupinám
                </Legend>

                <button
                  type="button"
                  className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() =>
                    append({
                      bodyId: '',
                      bodyName: '',
                    })
                  }
                >
                  <PlusCircleIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  Přidat stranu
                </button>
                <Field>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4">
                      <div className="flex flex-col flex-grow">
                        <Label htmlFor="memberships">Strana/skupina</Label>

                        <Controller
                          control={control}
                          name={`memberships.${index}.bodyId`}
                          render={({ field }) => (
                            <>
                              <input type="hidden" {...field} />
                              <AdminBodySelect
                                id={`memberships.${index}.bodyId`}
                                data={data}
                                onChange={field.onChange}
                                defaultValue={field.value}
                              />
                            </>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="since" isOptional>
                          Od
                        </Label>
                        <Input
                          type="date"
                          {...register(`memberships.${index}.since`)}
                        />
                      </div>
                      <div
                        className="flex flex-row 
                      items-center gap-2"
                      >
                        <div className="flex flex-col">
                          <Label htmlFor="until" isOptional>
                            Do
                          </Label>

                          <Input
                            type="date"
                            className="mb-4"
                            {...register(`memberships.${index}.until`)}
                          />
                        </div>
                        <TrashIcon
                          className="mt-4 h-6 w-6 text-gray-400 hover:text-indigo-600 cursor-pointer"
                          onClick={() => remove(index)}
                          title="Odstranit"
                        />
                      </div>
                    </div>
                  ))}
                </Field>
              </Fieldset>
            </div>
          </AdminFormContent>
        </div>
      </form>
    </>
  )
}
