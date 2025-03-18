'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { Field, Fieldset, Legend, Textarea } from '@headlessui/react'
import { z } from 'zod'
import { Label } from '../../forms/Label'
import { Controller, useForm, useFormState } from 'react-hook-form'
import { AdminSourceSpeakerSelect } from './AdminSourceSpeakerSelect'
import { ErrorMessage } from '../../forms/ErrorMessage'
import { statementSchema } from '@/libs/sources/statement-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { AdminPageTitle } from '../../layout/AdminPageTitle'
import { AdminFormActions } from '../../layout/AdminFormActions'
import { AdminStatementTypeSelect } from './AdminStatementTypeSelect'
import { AdminEvaluatorSelector } from './AdminEvaluatorSelect'

const AdminStatementFromTranscriptFormFragment = gql(`
    fragment AdminStatementFromTranscriptForm on Query {
      ...AdminExpertSelect
    }
  `)

const AdminStatementFromTranscriptDataFragment = gql(`
    fragment AdminStatementFromTranscriptData on Source {
      id
      sourceSpeakers {
        id
      }
      ...AdminSourceSpeakerSelect 
    }
  `)

type FieldValues = z.output<typeof statementSchema>

export function AdminStatementFromTranscriptForm(props: {
  statement: string
  source: FragmentType<typeof AdminStatementFromTranscriptDataFragment>
  data: FragmentType<typeof AdminStatementFromTranscriptFormFragment>
  onCancel: () => void
}) {
  const source = useFragment(
    AdminStatementFromTranscriptDataFragment,
    props.source
  )

  const data = useFragment(AdminStatementFromTranscriptFormFragment, props.data)

  const {
    control,
    trigger,
    formState: { errors, isValid },
    register,
  } = useForm<FieldValues>({
    resolver: zodResolver(statementSchema),
    defaultValues: {
      statementType: 'factual',
      sourceSpeakerId: source.sourceSpeakers?.[0]?.id ?? '',
      evaluatorId: '',
    },
  })

  return (
    <form className="mt-8">
      <AdminFormHeader>
        <AdminPageTitle title="Nový výrok" />
        <AdminFormActions>
          <a
            className="text-sm font-semibold leading-6 text-gray-900"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              props.onCancel()
            }}
          >
            Zrušit
          </a>
        </AdminFormActions>
      </AdminFormHeader>
      <AdminFormContent className="flex-col">
        <div className="col-span-12">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Základní údaje
            </Legend>
            <Field className="w-full">
              <Label htmlFor="content">Text výroku</Label>
              <Textarea
                id="content"
                className="w-full sm:text-sm text-gray-900 rounded-md shadow-sm border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                {...register('content', { required: true })}
                rows={10}
                placeholder="Vložte či vepište znění..."
                defaultValue={props.statement}
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
              <Label htmlFor="evaluatorId" isOptional>
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
                {...register('firstCommentContent')}
                rows={5}
                placeholder="Vložte či vepište znění..."
                className="w-full sm:text-sm text-gray-900 rounded-md shadow-sm border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p className="text-sm  text-gray-500">
                Bude přidána jako první komentář v diskuzi k výroku.
              </p>

              <ErrorMessage message={errors.statementType?.message} />
            </Field>
          </Fieldset>
        </div>
      </AdminFormContent>
    </form>
  )
}
