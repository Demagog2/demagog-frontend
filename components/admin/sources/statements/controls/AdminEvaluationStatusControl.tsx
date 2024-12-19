import { SecondaryButton } from '@/components/admin/layout/buttons/SecondaryButton'
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '@/libs/constants/assessment'
import { machine } from '@/libs/sources/machines/assessment-process-machine'

import { useSelector } from '@xstate/react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Actor } from 'xstate'

export function AdminEvaluationStatusControl<T extends FieldValues>(props: {
  control: Control<T>
  name: Path<T>
  actorRef: Actor<typeof machine>
  submitForm(): Promise<void>
}) {
  const { actorRef } = props

  const isBeingEvaluated = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ status: 'being_evaluated' })
  )

  const isApprovalNeeded = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ status: 'approval_needed' })
  )

  const isProofreadingNeeded = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ status: 'proofreading_needed' })
  )

  const isApproved = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ status: 'approved' })
  )

  const isPublished = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ status: 'published' })
  )

  const canRequestApproval = useSelector(actorRef, (snapshot) =>
    snapshot.can({ type: 'Request approval' })
  )

  const canReturnBackToEvaluation = useSelector(actorRef, (snapshot) =>
    snapshot.can({ type: 'Back to evaluation' })
  )

  const canRequestProofreading = useSelector(actorRef, (snapshot) =>
    snapshot.can({ type: 'Request proofreading' })
  )

  const canApprove = useSelector(actorRef, (snapshot) =>
    snapshot.can({ type: 'Approve' })
  )

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <div className="mt-2">
          <input type="hidden" name={field.name} value={field.value} />

          {isBeingEvaluated && (
            <>
              <SecondaryButton
                disabled={!canRequestApproval}
                onClick={() => {
                  props.actorRef.send({
                    type: 'Request approval',
                  })

                  field.onChange(ASSESSMENT_STATUS_APPROVAL_NEEDED)

                  props.submitForm()
                }}
              >
                Posunout ke kontrole
              </SecondaryButton>

              {!canRequestApproval && (
                <div className="mt-2">
                  <small className="text-gray-600">
                    Aby šel výrok posunout ke kontrole, musí být vyplněné
                    hodnocení a odůvodnění, včetně zkráceného.
                  </small>
                </div>
              )}
            </>
          )}

          {isApprovalNeeded && (
            <>
              <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <SecondaryButton
                  disabled={!canReturnBackToEvaluation}
                  onClick={() => {
                    props.actorRef.send({
                      type: 'Back to evaluation',
                    })

                    field.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)

                    props.submitForm()
                  }}
                >
                  Vrátit ke zpracování
                </SecondaryButton>
                <SecondaryButton
                  disabled={!canRequestProofreading}
                  onClick={() => {
                    props.actorRef.send({
                      type: 'Request proofreading',
                    })

                    field.onChange(ASSESSMENT_STATUS_PROOFREADING_NEEDED)

                    props.submitForm()
                  }}
                >
                  Posunout ke korektuře
                </SecondaryButton>
              </div>

              {!canRequestProofreading && (
                <div className="mt-2">
                  <small className="text-gray-600">
                    Ke korektuře může posunout výrok jen expert.
                  </small>
                </div>
              )}
            </>
          )}

          {isProofreadingNeeded && (
            <>
              <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <SecondaryButton
                  disabled={!canReturnBackToEvaluation}
                  onClick={() => {
                    props.actorRef.send({
                      type: 'Back to evaluation',
                    })

                    field.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)

                    props.submitForm()
                  }}
                >
                  Vrátit ke zpracování
                </SecondaryButton>
                <SecondaryButton
                  className="ml-2"
                  disabled={!canApprove}
                  onClick={() => {
                    props.actorRef.send({
                      type: 'Approve',
                    })

                    field.onChange(ASSESSMENT_STATUS_APPROVED)

                    props.submitForm()
                  }}
                >
                  Schválit
                </SecondaryButton>
              </div>

              {!canApprove && (
                <div className="mt-2">
                  <small className="text-gray-600">
                    Schválit výrok může jen korektor nebo expert.
                  </small>
                </div>
              )}
            </>
          )}

          {(isApproved || isPublished) && (
            <>
              <SecondaryButton
                disabled={!canReturnBackToEvaluation}
                onClick={() => {
                  props.actorRef.send({
                    type: 'Back to evaluation',
                  })

                  field.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)

                  props.submitForm()
                }}
              >
                Vrátit ke zpracování
              </SecondaryButton>
            </>
          )}
        </div>
      )}
    />
  )
}
