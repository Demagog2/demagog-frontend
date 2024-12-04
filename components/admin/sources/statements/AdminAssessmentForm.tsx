'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import { machine } from '@/libs/sources/machines/assessment-process-machine'
import { useMachine } from '@xstate/react'
import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { FormAction } from '@/libs/forms/form-action'
import { z } from 'zod'
import { assessmentSchema } from '@/libs/sources/statement-schema'
import { useFormToasts } from '../../forms/hooks/use-form-toasts'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { AdminPageTitle } from '../../layout/AdminPageTitle'
import { AdminFormActions } from '../../layout/AdminFormActions'
import { LinkButton } from '../../forms/LinkButton'
import { SubmitButton } from '../../forms/SubmitButton'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { Field, Fieldset, Legend } from '@headlessui/react'
import { Label } from '../../forms/Label'
import { AdminSourceSpeakerSelect } from './AdminSourceSpeakerSelect'
import { ErrorMessage } from '../../forms/ErrorMessage'
import { statementEditableMachine } from '@/libs/sources/machines/statement-editable-machine'
import { AdminSourceSpeakerControl } from './controls/AdminSourceSpeakerControl'

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

  const { isAuthorized } = useAuthorization(data.currentUser)

  const [state] = useMachine(statementEditableMachine, {
    input: {
      state: statement.assessment.evaluationStatus,
      isAuthorized,
      userId: data.currentUser.id,
      evaluatorId: statement.assessment.evaluator?.id,
    },
  })

  // const [state, send] = useMachine(machine, {
  //   input: { state: 'approval_needed', isAuthorized },
  // })

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
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      sourceSpeakerId: statement.sourceSpeaker.id,
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmitForm } = useFormSubmit<FieldValues>(
    handleSubmit,
    formAction,
    formRef
  )

  return (
    <form ref={formRef} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle
            title="Detail výroku"
            description={`Ověřování výroku ${statement.sourceSpeaker.fullName}`}
          />

          <AdminFormActions>
            <LinkButton href={`/beta/admin/sources/${statement.source.id}`}>
              Zpět
            </LinkButton>

            <SubmitButton isSubmitting={isSubmitting} />
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
                disabled={state.matches('disabled')}
                control={control}
                data={statement.source}
              />

              <ErrorMessage message={errors.sourceSpeakerId?.message} />
            </Field>
          </Fieldset>
        </AdminFormContent>
      </div>
    </form>
  )
}
