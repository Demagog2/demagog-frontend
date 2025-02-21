'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { accordionItemSchema } from '@/libs/accordion-section/schema'
import { FormAction } from '@/libs/forms/form-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useFormToasts } from '../forms/hooks/use-form-toasts'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { Input } from '../forms/Input'
import { SubmitButton } from '../forms/SubmitButton'
import { LinkButton } from '../forms/LinkButton'
import { AdminFormActions } from '../layout/AdminFormActions'
import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { Label } from '../forms/Label'
import { SwitchField } from '../forms/SwitchField'
import { Switch } from '../forms/Switch'
import { AdminFormMain } from '../layout/AdminFormMain'
import { AdminFormSidebar } from '../layout/AdminFormSidebar'
import { AdminFormContent } from '../layout/AdminFormContent'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { ErrorMessage } from '../forms/ErrorMessage'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(
  () => import('@/components/admin/forms/RichTextEditor'),
  { ssr: false }
)

const AdminAccordionItemDataFragment = gql(`
  fragment AdminAccordionItemData on AccordionItem{
    id
    title
    order
    published
    content
    memberListing
  }
`)

type FieldValues = z.output<typeof accordionItemSchema>

export function AdminAccordionItemForm(props: {
  action: FormAction
  title: string
  description?: string
  accordionItem?: FragmentType<typeof AdminAccordionItemDataFragment>
  sectionId?: string
}) {
  const accordionItem = useFragment(
    AdminAccordionItemDataFragment,
    props.accordionItem
  )
  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    register,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: zodResolver(accordionItemSchema),
    defaultValues: {
      title: accordionItem?.title ?? '',
      content: accordionItem?.content ?? '',
      order: accordionItem?.order ?? 0,
      published: accordionItem?.published ?? false,
      memberListing: accordionItem?.memberListing ?? false,
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminPageHeader>
        <AdminPageTitle title={props.title} description={props.description} />
        <AdminFormActions>
          <LinkButton
            href={`/beta/admin/accordion-sections/edit/${props.sectionId}`}
            className="btn h-50px fs-6 s-back-link"
          >
            Zpět
          </LinkButton>
          <SubmitButton />
        </AdminFormActions>
      </AdminPageHeader>
      <AdminFormContent>
        <AdminFormMain>
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Základní informace
            </Legend>
            <Field>
              <Label htmlFor="name">Název pložky</Label>

              <Input
                id="title"
                placeholder="Zadejte název…"
                hasError={!!errors?.title}
                {...register('title', { required: true })}
              />

              <ErrorMessage message={errors.title?.message} />
            </Field>
            <Field>
              <Label htmlFor="content" isOptional>
                Obsah
              </Label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="content"
                  render={({ field, fieldState: { isDirty } }) => (
                    <>
                      <Label htmlFor={field.name} isDirty={isDirty}></Label>
                      <input
                        type="hidden"
                        name={field.name}
                        value={field.value}
                      />
                      <RichTextEditor
                        includeHeadings
                        value={field.value ?? ''}
                        onChange={(value) => {
                          field.onChange(value)
                        }}
                      />
                    </>
                  )}
                />
              </div>
            </Field>
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
            <SwitchField
              htmlFor="published"
              label="Zveřejněný tag"
              description="Tag bude veřejně dostupný."
            >
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
            <SwitchField
              htmlFor="memberListing"
              label="Obsahuje seznam členů"
              description="Obsahuje seznam členů"
            >
              <Controller
                name="memberListing"
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
