'use client'

import { schema } from '@/libs/article-tags/schema'
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
import { Textarea } from '../forms/Textarea'
import { Switch } from '../forms/Switch'
import { SwitchField } from '../forms/SwitchField'

const AdminArticleTagDataFragment = gql(`
  fragment AdminArticleTagData on ArticleTag {
    title
    id
    slug
    description
    published
    order
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
      stats: articleTag?.stats ?? '',
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
            <LinkButton href="/beta/admin/article-tags">Zpět</LinkButton>
            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Field>
                  <Label htmlFor="title">Název tagu</Label>
                  <Input
                    id="title"
                    placeholder="Zadejte název tagu"
                    {...register('title', { required: true })}
                  ></Input>
                  {errors.title && (
                    <ErrorMessage message={errors.title?.message} />
                  )}
                </Field>
              </div>
              <div className="sm:col-span-3 sm:col-start-1">
                <Field>
                  <Label htmlFor="slug">Url tagu (slug)</Label>
                  <Input
                    id="slug"
                    placeholder="Zadejte url"
                    {...(register('slug'), { required: true })}
                  ></Input>
                  {errors.slug && (
                    <ErrorMessage message={errors.slug?.message} />
                  )}
                </Field>
              </div>
              <div className="sm:col-span-full sm:col-start-1">
                <Field>
                  <Label htmlFor="description">Popis</Label>
                  <Textarea
                    id="description"
                    {...register('description', { required: false })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-1 sm:col-start-1">
                <Field>
                  <Label htmlFor="order">Pozice</Label>
                  <Input
                    id="order"
                    {...(register('order'), { required: false })}
                  ></Input>
                </Field>
              </div>
              <div className="sm:col-span-3 sm:col-start-1 flex items-center gap-3">
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
                <SwitchField htmlFor="published" label="Zveřejněný tag" />
              </div>
              <div className="sm:col-span-1 sm:col-start-1">
                <Field>
                  <Label htmlFor="icon">Ikona</Label>
                  <Select
                    id="icon"
                    aria-label="Ikona"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('icon', { required: false })}
                  >
                    <option value="0">Žádná</option>
                    <option value="1">Základní</option>
                    <option value="2">Prezidentská</option>
                    <option value="3">Slovensko</option>
                    <option value="4">Ukrajina</option>
                  </Select>
                </Field>
              </div>
              <div className="sm:col-span-1 sm:col-start-1">
                <Field>
                  <Label htmlFor="stats">Statistika</Label>
                  <Select
                    id="stats"
                    aria-label="Statistika"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('stats', { required: false })}
                  >
                    <option value="0">Žádná</option>
                    <option value="1">Články</option>
                    <option value="2">Výroky</option>
                  </Select>
                </Field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
