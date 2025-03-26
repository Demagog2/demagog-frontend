'use client'

import { gql, useFragment } from '@/__generated__'
import { quizSchema } from '@/libs/education/quiz-schema'
import { FragmentType } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AdminFormHeader } from '../layout/AdminFormHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { AdminFormActions } from '../layout/AdminFormActions'
import { LinkButton } from '../forms/LinkButton'
import { SubmitButton } from '../forms/SubmitButton'
import { AdminFormContent } from '../layout/AdminFormContent'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { Label } from '../forms/Label'
import { Input } from '../forms/Input'
import { Textarea } from '../forms/Textarea'
import { ErrorMessage } from '../forms/ErrorMessage'
import { Switch } from '../forms/Switch'
import { SwitchField } from '../forms/SwitchField'
import { Controller } from 'react-hook-form'
import { TrashIcon } from '@heroicons/react/24/outline'
import { FormAction } from '@/libs/forms/form-action'
import { useFormToasts } from '../forms/hooks/use-form-toasts'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { useFormState } from 'react-dom'

const AdminQuizDataFragment = gql(`
  fragment AdminQuizData on QuizQuestion {
    title
    description
    quizAnswers {
      id
      text
      isCorrect
    }
  }
`)

type FieldValues = z.output<typeof quizSchema>

export function AdminQuizQuestionForm(props: {
  title: string
  action: FormAction
  description?: string
  quiz?: FragmentType<typeof AdminQuizDataFragment>
}) {
  const quiz = useFragment(AdminQuizDataFragment, props.quiz)
  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    register,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quiz?.title ?? '',
      description: quiz?.description ?? '',
      quizAnswers:
        quiz?.quizAnswers?.map((answer) => ({
          text: answer.text,
          isCorrect: answer.isCorrect,
        })) ?? [],
      ...(state?.state === 'initial' ? {} : state.fields),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quizAnswers',
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminFormHeader>
        <AdminPageTitle title={props.title} description={props.description} />
        <AdminFormActions>
          <LinkButton href={`/beta/admin/education`}>Zpět</LinkButton>
          <SubmitButton />
        </AdminFormActions>
      </AdminFormHeader>
      <AdminFormContent>
        <div className="col-span-12 gap-y-8">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Otázka
            </Legend>
            <Field>
              <Label htmlFor="title">Název otázky</Label>
              <Input
                id="title"
                className="w-full"
                {...register('title', { required: true })}
              />
              <ErrorMessage message={errors.title?.message} />
            </Field>
            <Field>
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                {...register('description', { required: true })}
              />
              <ErrorMessage message={errors.description?.message} />
            </Field>
          </Fieldset>
          <Fieldset className="space-y-4 w-full pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Odpovědi
            </Legend>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 border-b border-gray-900/10 pb-4"
              >
                <Field>
                  <div className="flex justify-between items-end">
                    <Label htmlFor={`quizAnswers.${index}.text`}>
                      Odpověď {String.fromCharCode(65 + index)}
                    </Label>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-4 p-2 text-gray-400 hover:text-indigo-600"
                      title="Odstranit odpověď"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <Textarea
                    id={`quizAnswers.${index}.text`}
                    {...register(`quizAnswers.${index}.text`, {
                      required: true,
                    })}
                    placeholder="Zadejte text odpovědi..."
                  />
                  <ErrorMessage
                    message={errors.quizAnswers?.[index]?.text?.message}
                  />
                  <div className="sm:col-span-3 sm:col-start-1 flex items-end gap-2 mt-3">
                    <Controller
                      name={`quizAnswers.${index}.isCorrect`}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id={field.name}
                          name={field.name}
                          checked={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <SwitchField
                      htmlFor={`quizAnswers.${index}.isCorrect`}
                      label="Správná odpověď"
                    />
                  </div>
                </Field>
              </div>
            ))}
            <div className="mt-4">
              <button
                type="button"
                onClick={() =>
                  append({
                    text: '',
                    isCorrect: false,
                  })
                }
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Přidat odpověď
              </button>
            </div>
          </Fieldset>
        </div>
      </AdminFormContent>
    </form>
  )
}
