'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import { machine } from '@/libs/sources/machines/assessment-process-machine'
import { useMachine } from '@xstate/react'
import React, { useMemo } from 'react'
import { useFormState } from 'react-dom'
import { useFormSubmitV2 } from '@/libs/forms/hooks/form-submit-hook'
import { FormAction } from '@/libs/forms/form-action'
import { z } from 'zod'
import { assessmentSchema } from '@/libs/sources/statement-schema'
import { useFormToasts } from '../../forms/hooks/use-form-toasts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { AdminPageTitle } from '../../layout/AdminPageTitle'
import { AdminFormActions } from '../../layout/AdminFormActions'
import { LinkButton } from '../../forms/LinkButton'
import { SubmitButton } from '../../forms/SubmitButton'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { Label } from '../../forms/Label'
import { ErrorMessage } from '../../forms/ErrorMessage'
import { AdminSourceSpeakerControl } from './controls/AdminSourceSpeakerControl'
import { Input } from '../../forms/Input'

const AdminAssessmentFormFragment = gql(`
  fragment AdminAssessmentForm on Query {
    currentUser {
      id
      ...Authorization
    }
  }  
`)

const AdminStatementAssessmentFragment = gql(`
  fragment AdminStatementAssessment on Statement {
    statementType
    title
    sourceSpeaker {
      id
      fullName
    }
    source {
      id
      ...AdminSourceSpeakerControl
    }
    assessment {
      evaluator {
        id
      }
      evaluationStatus
    }
  }  
`)

type FieldValues = z.output<typeof assessmentSchema>

export function AdminAssessmentForm(props: {
  action: FormAction
  data: FragmentType<typeof AdminAssessmentFormFragment>
  statement: FragmentType<typeof AdminStatementAssessmentFragment>
}) {
  const data = useFragment(AdminAssessmentFormFragment, props.data)
  const statement = useFragment(
    AdminStatementAssessmentFragment,
    props.statement
  )

  const authorization = useAuthorization(data.currentUser)

  const [state] = useMachine(machine, {
    input: {
      authorization,
      state: statement.assessment.evaluationStatus,
      evaluatorId: statement.assessment.evaluator?.id,
      statementType: statement.statementType,
    },
  })

  // if (state.matches('Being evaluated')) {
  //   return (
  //     <div>
  //       Being evaluated
  //       <button onClick={() => send({ type: 'Request approval' })}>
  //         Request approval
  //       </button>
  //     </div>
  //   )
  // }

  // if (state.matches('Approval needed')) {
  //   return (
  //     <div>
  //       Approval needed
  //       <button
  //         disabled={state.can({ type: 'Request proofreading' })}
  //         onClick={() => send({ type: 'Request proofreading' })}
  //       >
  //         Request proofreading
  //       </button>
  //       <button onClick={() => send({ type: 'Back to evaluation' })}>
  //         Back to evaluation
  //       </button>
  //     </div>
  //   )
  // }

  // if (state.matches('Proofreading needed')) {
  //   return (
  //     <div>
  //       Proofreading needed
  //       <button onClick={() => send({ type: 'Approve' })}>Aprove</button>
  //       <button onClick={() => send({ type: 'Back to evaluation' })}>
  //         Back to evaluation
  //       </button>
  //     </div>
  //   )
  // }

  // if (state.matches('Approved')) {
  //   return (
  //     <div>
  //       Approved{' '}
  //       <button onClick={() => send({ type: 'Back to evaluation' })}>
  //         Back to evaluation
  //       </button>
  //     </div>
  //   )
  // }

  const [formState, formAction] = useFormState(props.action, {
    state: 'initial',
  })

  useFormToasts(formState)

  const {
    control,
    register,
    formState: { errors, isValid },
    trigger,
  } = useForm<FieldValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      sourceSpeakerId: statement.sourceSpeaker.id,
      title: statement.title ?? '',
    },
  })

  const { handleSubmitForm } = useFormSubmitV2(isValid, trigger)

  const isStatementFieldDisabled =
    state.matches({
      status: { being_evaluated: 'disabled' },
    }) ||
    state.matches({
      status: { approval_needed: 'disabled' },
    }) ||
    state.matches({
      status: { proofreading_needed: 'disabled' },
    }) ||
    state.matches({ status: 'approved' })

  const title = useMemo(() => {
    if (state.matches({ type: 'promise' })) {
      return `Detail slibu`
    }

    return `Detail výroku`
  }, [state])

  const description = useMemo(() => {
    if (state.matches({ type: 'factual' })) {
      return `Ověřování faktického výroku ${statement.sourceSpeaker.fullName}`
    }

    if (state.matches({ type: 'promise' })) {
      return `Ověřování slibu ${statement.sourceSpeaker.fullName}`
    }

    return `Ověřování silvestrovského výroku ${statement.sourceSpeaker.fullName}`
  }, [state])

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={title} description={description} />

          <AdminFormActions>
            <LinkButton href={`/beta/admin/sources/${statement.source.id}`}>
              Zpět
            </LinkButton>

            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>
        <AdminFormContent className="flex-col">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Výrok
            </Legend>

            <Field>
              <Label htmlFor="sourceSpeakerId">Řečník</Label>

              <AdminSourceSpeakerControl
                name="sourceSpeakerId"
                disabled={isStatementFieldDisabled}
                control={control}
                data={statement.source}
              />

              <ErrorMessage message={errors.sourceSpeakerId?.message} />
            </Field>

            {state.matches({ type: 'promise' }) && (
              <Field>
                <Label htmlFor="title">Titulek</Label>

                <Input
                  id="title"
                  disabled={isStatementFieldDisabled}
                  {...register('title')}
                />

                <ErrorMessage message={errors.title?.message} />
              </Field>
            )}

            {(state.matches({ type: 'promise' }) ||
              state.matches({ type: 'factual' })) && (
              <Field>
                <Label htmlFor="tags">Štítky</Label>
              </Field>
            )}
          </Fieldset>
        </AdminFormContent>
      </div>
    </form>
  )
}
