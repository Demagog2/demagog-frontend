'use client'

import { schema } from '@/libs/article-tags/schema'
import { Field, Fieldset, Legend, Select } from '@headlessui/react'
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
import { Textarea } from '../forms/Textarea'
import { Switch } from '../forms/Switch'
import { SwitchField } from '../forms/SwitchField'
import { AdminFormMain } from '../layout/AdminFormMain'
import { AdminFormSidebar } from '../layout/AdminFormSidebar'
import { AdminFormContent } from '../layout/AdminFormContent'

const AdminArticleTagDataFragment = gql(`
  fragment AdminArticleTagData on ArticleTag {
    title
    id
    slug
    description
    published
    order
    icon
    stats
  }
`)

export function AdminArticleTagForm(props: {
  title: string
  description?: string
  articleTag?: FragmentType<typeof AdminArticleTagDataFragment>
  action: FormAction
}) {
  const [state, formAction] = useFormState(props.action, {
    state: 'initial',
  })

  const articleTag = useFragment(AdminArticleTagDataFragment, props.articleTag)

  useFormToasts(state)

  const {
    register,
    control,
    trigger,
    formState: { isValid, errors },
  } = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: articleTag?.title ?? '',
      slug: articleTag?.slug ?? '',
      description: articleTag?.description ?? '',
      published: articleTag?.published ?? false,
      order: articleTag?.order ?? '',
      icon: articleTag?.icon ?? '',
      stats: articleTag?.stats ?? '',
      ...(state.state === 'initial' ? {} : state.fields),
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminFormHeader>
        <AdminPageTitle title={props.title} />
        <AdminFormActions>
          <LinkButton href="/beta/admin/article-tags">Zpět</LinkButton>
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
              <Label htmlFor="title">Název tagu</Label>
              <Input
                id="title"
                placeholder="Zadejte název tagu"
                {...register('title', { required: true })}
              />

              <ErrorMessage message={errors.title?.message} />
            </Field>
            <Field>
              <Label htmlFor="slug">Url tagu (slug)</Label>
              <Input
                id="slug"
                placeholder="Zadejte url"
                {...register('slug', { required: true })}
              />

              <ErrorMessage message={errors.slug?.message} />
            </Field>
          </Fieldset>

          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="mt-8 text-base font-semibold leading-7 text-gray-900">
              Popis a zobrazení
            </Legend>

            <Field>
              <Label htmlFor="description" isOptional>
                Popis
              </Label>
              <Textarea id="description" {...register('description')} />
            </Field>

            <Field>
              <Label htmlFor="icon" isOptional>
                Ikona
              </Label>
              <Select
                id="icon"
                aria-label="Ikona"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register('icon')}
              >
                <option value="0">Žádná</option>
                <option value="1">Základní</option>
                <option value="2">Prezidentská</option>
                <option value="3">Slovensko</option>
                <option value="4">Ukrajina</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="stats" isOptional>
                Statistika
              </Label>
              <Select
                id="stats"
                aria-label="Statistika"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register('stats')}
              >
                <option value="0">Žádná</option>
                <option value="1">Články</option>
                <option value="2">Výroky</option>
              </Select>
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

              <ErrorMessage message={errors.order?.message} />
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
          </Fieldset>
        </AdminFormSidebar>
      </AdminFormContent>
    </form>
  )
}
