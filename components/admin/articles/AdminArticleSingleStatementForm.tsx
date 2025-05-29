'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { singleStatementArticleSchema } from '@/libs/articles/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { SubmitButton } from '../forms/SubmitButton'
import { Button, Field, Fieldset } from '@headlessui/react'
import { Label } from '../forms/Label'
import { Input } from '../forms/Input'
import { AdminArticleIllustrationInput } from './AdminArticleIllustrationInput'
import { SwitchField } from '../forms/SwitchField'
import { Switch } from '../forms/Switch'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminArticleIllustrationDialog } from '@/components/admin/articles/AdminArticleIllustrationDialog'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminFormHeader } from '@/components/admin/layout/AdminFormHeader'
import { AdminFormActions } from '../layout/AdminFormActions'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { dateInputFormat } from '@/libs/date-time'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { FormAction } from '@/libs/forms/form-action'
import { AdminFormContent } from '../layout/AdminFormContent'
import { AdminFormMain } from '../layout/AdminFormMain'
import { AdminFormSidebar } from '../layout/AdminFormSidebar'
import { SecondaryButton } from '../layout/buttons/SecondaryButton'

const AdminArticleSingleStatementFormFragment = gql(`
  fragment AdminArticleSingleStatementFormFields on Article {
    title
    published
    publishedAt
    segments {
      id
      segmentType
      statementId
    }
    illustrationCaption
    ...AdminArticleIllustration
  }
`)

export function AdminArticleSingleStatementForm(props: {
  title: string
  description?: string
  article?: FragmentType<typeof AdminArticleSingleStatementFormFragment>
  action: FormAction
}) {
  const [isOpen, setDialogOpen] = useState<boolean>(false)

  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const article = useFragment(
    AdminArticleSingleStatementFormFragment,
    props.article
  )

  const {
    register,
    trigger,
    control,
    setValue,
    formState: { isValid },
  } = useForm<z.output<typeof singleStatementArticleSchema>>({
    resolver: zodResolver(singleStatementArticleSchema),
    defaultValues: {
      title: article?.title ?? '',
      published: article?.published ?? false,
      publishedAt: dateInputFormat(
        article?.publishedAt ?? new Date().toISOString()
      ),
      statementId: article?.segments?.[0]?.statementId ?? undefined,
      illustrationCaption: article?.illustrationCaption ?? '',
      deleteIllustration: false,
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <>
      <form action={formAction} onSubmit={handleSubmitForm}>
        <input type="hidden" {...register('deleteIllustration')} />
        <AdminFormHeader>
          <AdminPageTitle title={props.title} description={props.description} />

          <AdminFormActions>
            <LinkButton href="/beta/admin/articles">Zpět</LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormContent>
          <AdminFormMain className="col-span-12 lg:col-span-9 gap-y-5 grid grid-cols-1">
            <div className="grow gap-y-5 grid grid-cols-1">
              <Fieldset className="space-y-4">
                <Field>
                  <Label htmlFor="title">Název článku</Label>

                  <Input
                    id="title"
                    placeholder="Upravit název…"
                    {...register('title', { required: true })}
                  />
                </Field>

                <Field>
                  <Label htmlFor="illustration">Ilustrační obrázek</Label>

                  <AdminArticleIllustrationInput
                    article={article}
                    control={control}
                    onDeleteImage={() => setValue('deleteIllustration', true)}
                    name="illustration"
                  />
                </Field>

                <Field>
                  <Label htmlFor="illustrationCaption" isOptional>
                    Popisek obrázku
                  </Label>

                  <Input
                    id="illustrationCaption"
                    placeholder="Zadejte popisek obrázku..."
                    {...register('illustrationCaption')}
                  />
                </Field>

                <Field>
                  <Label htmlFor="statementId">Výrok</Label>
                  <Input
                    type="number"
                    id="statementId"
                    {...register('statementId')}
                  />
                </Field>
              </Fieldset>
            </div>
          </AdminFormMain>
          <AdminFormSidebar>
            <div className="min-w-[25%] gap-y-5 grid grid-cols-1 content-start">
              <Fieldset className="space-y-4">
                <Field>
                  <SecondaryButton
                    type="button"
                    onClick={() => setDialogOpen(true)}
                  >
                    Vygenerovat obrázek pro tweet
                  </SecondaryButton>
                </Field>

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
              </Fieldset>
            </div>
          </AdminFormSidebar>
        </AdminFormContent>
      </form>

      <AdminArticleIllustrationDialog
        isOpen={isOpen}
        onClose={() => setDialogOpen(false)}
        onSave={(image) => setValue('illustration', image)}
      />
    </>
  )
}
