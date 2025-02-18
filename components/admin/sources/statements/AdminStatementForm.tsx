'use client'

import { AdminFormHeader } from '@/components/admin/layout/AdminFormHeader'

import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminFormActions } from '@/components/admin/layout/AdminFormActions'
import { AdminFormContent } from '@/components/admin/layout/AdminFormContent'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { SubmitButton } from '@/components/admin/forms/SubmitButton'
import { useFormState } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { Textarea } from '@/components/admin/forms/Textarea'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { FormAction } from '@/libs/forms/form-action'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'
import { statementSchema } from '@/libs/sources/statement-schema'
import { AdminEvaluatorSelector } from './AdminEvaluatorSelect'
import { AdminStatementTypeSelect } from './AdminStatementTypeSelect'
import { AdminSourceSpeakerSelect } from './AdminSourceSpeakerSelect'
import { AlertMessage } from '@/components/admin/layout/AlertMessage'

const AdminStatementFormFragment = gql(`
  fragment AdminStatementForm on Query {
    ...AdminExpertSelect
  }
`)

const AdminStatementSourceDetailsFormFragment = gql(`
  fragment AdminStatementSourceDetailsForm on Source {
    id
    sourceSpeakers {
      id
    }
    ...AdminSourceSpeakerSelect
  }
`)

type FieldValues = z.output<typeof statementSchema>

export function AdminStatementForm(props: {
  title: string
  description?: string
  action: FormAction
  data: FragmentType<typeof AdminStatementFormFragment>
  source: FragmentType<typeof AdminStatementSourceDetailsFormFragment>
}) {
  const data = useFragment(AdminStatementFormFragment, props.data)

  const source = useFragment(
    AdminStatementSourceDetailsFormFragment,
    props.source
  )

  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    control,
    trigger,
    formState: { errors, isValid },
    register,
  } = useForm<FieldValues>({
    resolver: zodResolver(statementSchema),
    defaultValues: {
      statementType: 'factual',
      sourceId: source.id,
      sourceSpeakerId: source.sourceSpeakers?.[0]?.id ?? '',
      evaluatorId: '',

      ...(state.state === 'initial' ? {} : state.fields),
    },
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <input type="hidden" {...register('sourceId')} />

      <div className="container">
        <AlertMessage
          className="my-4"
          title="Vytváření výroku"
          message="Vytváření výroků výběrem z přepisu ještě není naimplementováno."
        />

        <AdminFormHeader>
          <AdminPageTitle title={props.title} description={props.description} />

          <AdminFormActions>
            <LinkButton href="/beta/admin/sources">Zpět</LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormContent className="flex-col">
          <div className="col-span-12">
            <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
              <Legend className="text-base font-semibold leading-7 text-gray-900">
                Základní údaje
              </Legend>

              <Field>
                <Label htmlFor="content">Text výroku</Label>

                <Textarea
                  id="content"
                  {...register('content', { required: true })}
                  rows={10}
                  placeholder="Vložte či vepište znění..."
                />

                <ErrorMessage message={errors.content?.message} />
              </Field>

              <Field>
                <Label htmlFor="sourceSpeakerId">Řečník</Label>

                <Controller
                  control={control}
                  name="sourceSpeakerId"
                  render={({ field }) => (
                    <>
                      <input type="hidden" {...field} />
                      <AdminSourceSpeakerSelect
                        id="sourceSpeakerId"
                        data={source}
                        onChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </>
                  )}
                />

                <ErrorMessage message={errors.sourceSpeakerId?.message} />
              </Field>

              <Field>
                <Label htmlFor="statementType">Typ výroku</Label>

                <Controller
                  control={control}
                  name="statementType"
                  render={({ field }) => (
                    <>
                      <input type="hidden" {...field} />
                      <AdminStatementTypeSelect
                        id="statementType"
                        onChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </>
                  )}
                />

                <ErrorMessage message={errors.statementType?.message} />
              </Field>
            </Fieldset>

            <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
              <Legend className="text-base font-semibold leading-7 text-gray-900">
                Ověřování
              </Legend>

              <Field>
                <Label htmlFor="statementType" isOptional>
                  Ověřovatel
                </Label>

                <Controller
                  control={control}
                  name="evaluatorId"
                  render={({ field }) => (
                    <>
                      <input type="hidden" {...field} />
                      <AdminEvaluatorSelector
                        id="evaluatorId"
                        data={data}
                        onChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </>
                  )}
                />

                <ErrorMessage message={errors.evaluatorId?.message} />
              </Field>

              <Field>
                <Label htmlFor="firstCommentContent" isOptional>
                  Poznámka pro ověřování
                </Label>

                <Textarea
                  id="firstCommentContent"
                  {...register('firstCommentContent', { required: true })}
                  rows={5}
                  placeholder="Vložte či vepište znění..."
                />

                <ErrorMessage message={errors.statementType?.message} />
              </Field>
            </Fieldset>
          </div>
        </AdminFormContent>
      </div>
    </form>
  )
}
