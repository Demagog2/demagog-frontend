'use client'

import { Input } from '../forms/Input'
import { SubmitButton } from '../forms/SubmitButton'
import { LinkButton } from '../forms/LinkButton'
import { AdminFormActions } from '../layout/AdminFormActions'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { Label } from '../forms/Label'
import { FormAction } from '@/libs/forms/form-action'
import { useFormState } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { AdminFormContent } from '../layout/AdminFormContent'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { accordionSectionSchema } from '@/libs/accordion-section/schema'
import { SwitchField } from '../forms/SwitchField'
import { Switch } from '../forms/Switch'
import { AdminFormMain } from '../layout/AdminFormMain'
import { AdminFormSidebar } from '../layout/AdminFormSidebar'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import AdminAccordionItems from '../accordion-items/AdminAccordionItems'
import { AdminFormHeader } from '../layout/AdminFormHeader'

const AdminAccordionSectionDataFragment = gql(`
  fragment AdminAccordionSectionData on AccordionSection {
    id
    title
    order
    published
    ...AdminAccordionItems
  } 
`)

type FieldValues = z.output<typeof accordionSectionSchema>

export function AdminAccordionSectionForm(props: {
  action: FormAction
  title: string
  description?: string
  accordionSection?: FragmentType<typeof AdminAccordionSectionDataFragment>
}) {
  const accordionSection = useFragment(
    AdminAccordionSectionDataFragment,
    props.accordionSection
  )
  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    register,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: zodResolver(accordionSectionSchema),
    defaultValues: {
      title: accordionSection?.title ?? '',
      order: accordionSection?.order ?? 0,
      published: accordionSection?.published ?? false,
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)
  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminFormHeader>
        <AdminPageTitle title={props.title} description={props.description} />
        <AdminFormActions>
          <LinkButton
            href={`/beta/admin/accordion-sections`}
            className="btn h-50px fs-6 s-back-link"
          >
            Zpět
          </LinkButton>
          <SubmitButton />
        </AdminFormActions>
      </AdminFormHeader>

      <AdminFormContent>
        <AdminFormMain>
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Základní informace
            </Legend>
            <Field>
              <Label htmlFor="name">Název sekce</Label>

              <Input
                id="title"
                placeholder="Zadejte název…"
                hasError={!!errors?.title}
                {...register('title', { required: true })}
              />

              <ErrorMessage message={errors.title?.message} />
            </Field>

            {accordionSection && (
              <>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Položky sekce
                </label>
                <AdminAccordionItems accordionItem={accordionSection} />
                <a
                  href={`/beta/admin/accordion-sections/${accordionSection?.id}/items/new`}
                >
                  <button
                    type="button"
                    className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-2"
                  >
                    <PlusCircleIcon
                      aria-hidden="true"
                      className="-ml-0.5 h-5 w-5"
                    />
                    Přidat položku sekce
                  </button>
                </a>
              </>
            )}
          </Fieldset>
        </AdminFormMain>
        <AdminFormSidebar>
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Zveřejnění
            </Legend>
            <Field>
              <Label htmlFor="order" isOptional>
                Pozice
              </Label>

              <Input id="order" type="number" {...register('order')} />
            </Field>
            <SwitchField htmlFor="published" label="Zveřejněná sekce">
              <Controller
                name="published"
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
            </SwitchField>
          </Fieldset>
        </AdminFormSidebar>
      </AdminFormContent>
    </form>
  )
}
