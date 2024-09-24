'use client'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { ARTICLE_TYPE_LABEL } from '@/libs/constants/article-type'
import { SubmitButton } from '@/components/admin/forms/SubmitButton'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { Switch } from '@/components/admin/forms/Switch'
import { SwitchField } from '@/components/admin/forms/SwitchField'
import { Label } from '@/components/admin/forms/Label'
import { ArticleTypeEnum } from '@/__generated__/graphql'
import { ARTICLE_VERACITY_OPTIONS } from '@/libs/constants/article-veracity'
import { Button, Field } from '@headlessui/react'
import { Input } from '@/components/admin/forms/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { schema } from '@/libs/articles/schema'
import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { FormState } from '@/app/(admin)/admin/articles/new/actions'

export const AdminArticleFormFragment = gql(`
  fragment AdminArticleForm on Query {
    articleTags {
      id
      title
    }
  }
`)

export function AdminArticleForm(props: {
  data: FragmentType<typeof AdminArticleFormFragment>
  action(prevState: FormState, input: unknown): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { message: '' })
  const data = useFragment(AdminArticleFormFragment, props.data)

  const { register, watch, handleSubmit, control } = useForm<
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      articleType: ArticleTypeEnum.Default,
      segments: [],
      pinned: false,
      published: false,
      publishedAt: new Date().toISOString().substring(0, 10),
      articleTags: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'segments',
  })

  const formRef = useRef<HTMLFormElement>(null)

  const selectedArticleType = watch('articleType', ArticleTypeEnum.Default)

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(() => formRef.current?.submit())}
    >
      <div className="container">
        <div className="flex gap-5 border-b border-gray-900/10 pb-12">
          <div className="grow gap-y-5 grid grid-cols-1">
            <Field>
              <Label htmlFor="title">Název článku</Label>

              <Input
                id="title"
                placeholder="Upravit název…"
                {...register('title', { required: true })}
              />
            </Field>

            {selectedArticleType === ArticleTypeEnum.FacebookFactcheck && (
              <Field>
                <Label htmlFor="titleEn">Anglický název článku</Label>

                <Input
                  id="titleEn"
                  placeholder="Upravit anglický název…"
                  {...register('titleEn', { required: true })}
                />
              </Field>
            )}

            <Field>
              <Label htmlFor="perex">Perex</Label>

              <textarea
                {...register('perex', { required: true })}
                id="perex"
                rows={4}
                className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Zadejte perex..."
              />
            </Field>

            <Field>
              <Label htmlFor="">Obsah</Label>
            </Field>

            <Button
              onClick={() => append({ segmentType: 'text', textHtml: '' })}
            >
              Add segment
            </Button>

            {fields.map((field, index) => (
              <div key={field.id}>
                <input
                  type="hidden"
                  {...register(`segments.${index}.segmentType`)}
                />
                <textarea
                  {...register(`segments.${index}.textHtml`)}
                ></textarea>
                <Button onClick={() => remove(index)}>Remove segment</Button>
              </div>
            ))}

            {/*<Field>*/}
            {/*  <Label htmlFor="articleTag">Tagy článku</Label>*/}

            {/*  <select*/}
            {/*    id="articleTag"*/}
            {/*    {...register('articleTags', { required: false })}*/}
            {/*    defaultValue=""*/}
            {/*    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
            {/*  >*/}
            {/*    <option value="">Please select</option>*/}
            {/*    {data.articleTags.map((tag) => (*/}
            {/*      <option key={tag.id} value={tag.id}>*/}
            {/*        {tag.title}*/}
            {/*      </option>*/}
            {/*    ))}*/}
            {/*  </select>*/}
            {/*</Field>*/}
          </div>
          <div className="grow-0 w-1/4 gap-y-5 grid grid-cols-1 content-start">
            <div>
              <Label htmlFor="articleType">Typ článku</Label>
              <select
                id="articleType"
                {...register('articleType', { required: true })}
                defaultValue={ArticleTypeEnum.Default}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {Object.entries(ARTICLE_TYPE_LABEL).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <SwitchField
              htmlFor="pinned"
              label="Připnout článek"
              description="Článek bude trvale zobrazen na hlavní stránce jako první"
            >
              <Controller
                name="pinned"
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
              htmlFor="published"
              label="Zveřejněný článek"
              description="Článek bude veřejně dostupný."
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

            <Field>
              <Label htmlFor="publishedAt">Datum zveřejnění</Label>

              <Input
                id="publishedAt"
                type="date"
                {...register('publishedAt')}
              />
            </Field>

            <div>
              <Label htmlFor="articleVeracity">Pravdivost článku</Label>
              <select
                disabled={
                  selectedArticleType !== ArticleTypeEnum.FacebookFactcheck
                }
                id="articleVeracity"
                {...register('articleVeracity', { required: true })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
              >
                {ARTICLE_VERACITY_OPTIONS.map((articleVeracity) => (
                  <option
                    key={articleVeracity.value}
                    value={articleVeracity.value}
                  >
                    {articleVeracity.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <LinkButton href="/admin/articles">Zpět</LinkButton>

          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
