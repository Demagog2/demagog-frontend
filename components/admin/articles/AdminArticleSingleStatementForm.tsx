'use client'

import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { singleStatementArticleSchema } from '@/libs/articles/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { SubmitButton } from '../forms/SubmitButton'
import { Field, Fieldset } from '@headlessui/react'
import { Label } from '../forms/Label'
import { Input } from '../forms/Input'
import { AdminArticleIllustrationInput } from './AdminArticleIllustrationInput'
import { SwitchField } from '../forms/SwitchField'
import { Switch } from '../forms/Switch'
import { FormState } from '@/app/(admin)/admin/articles/actions'
import { invariant } from '@apollo/client/utilities/globals'
import { FragmentType, gql, useFragment } from '@/__generated__'

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
  }
`)

export function AdminArticleSingleStatementForm(props: {
  article?: FragmentType<typeof AdminArticleSingleStatementFormFragment>
  action(prevState: FormState, input: FormData): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { message: '' })
  const article = useFragment(
    AdminArticleSingleStatementFormFragment,
    props.article
  )

  const { register, handleSubmit, control } = useForm<
    z.output<typeof singleStatementArticleSchema>
  >({
    resolver: zodResolver(singleStatementArticleSchema),
    defaultValues: {
      title: article?.title ?? '',
      published: article?.published ?? false,
      publishedAt:
        article?.publishedAt?.substring(0, 10) ??
        new Date().toISOString().substring(0, 10),
      statementId: article?.segments?.[0]?.statementId ?? undefined,
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(
        (data) => {
          const formElem = formRef.current
          invariant(formElem, 'Form HTML DOM element must be present.')
          formAction(new FormData(formElem))

          // TODO: @vaclavbohac Remove once we are sure the forms are bug free
          console.debug('Valid form data', data)
        },
        (data) => {
          // TODO: @vaclavbohac Remove once we are sure the forms are bug free
          console.debug('Invalid form data', data)
        }
      )}
    >
      <div className="container">
        <div className="flex gap-5 border-b border-gray-900/10 pb-12">
          {/* Main panel */}
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
                  control={control}
                  name="illustration"
                />
              </Field>

              <Field>
                <Label htmlFor="statementId">Výrok</Label>
                <input id="statementId" {...register('statementId')} />
              </Field>

              <SubmitButton />
            </Fieldset>
          </div>

          {/* Right panel */}
          <div className="min-w-[25%] gap-y-5 grid grid-cols-1 content-start">
            <Fieldset className="space-y-4">
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
        </div>
      </div>
    </form>
  )
}
