import { FragmentType, gql, useFragment } from '@/__generated__'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import { machine } from '@/libs/sources/machines/assessment-process-machine'
import { useActorRef, useSelector } from '@xstate/react'
import { useMemo } from 'react'

const StatementEvaluationMachineQueryFragment = gql(`
  fragment StatementEvaluationMachineQueryData on Query {
    ...Authorization
  }
`)

const StatementEvaluationMachineFragment = gql(`
  fragment StatementEvaluationMachine on Statement {
    statementType
    assessment {
      veracity {
        id
      }
      promiseRating {
        id
      }
      explanation
      shortExplanation
      evaluationStatus
      evaluator {
        id
      }
    }
  }
`)

export function useStatementEvaluationMachine(props: {
  data: FragmentType<typeof StatementEvaluationMachineQueryFragment>
  statement: FragmentType<typeof StatementEvaluationMachineFragment>
}) {
  const queryData = useFragment(
    StatementEvaluationMachineQueryFragment,
    props.data
  )

  const statement = useFragment(
    StatementEvaluationMachineFragment,
    props.statement
  )

  const authorization = useAuthorization(queryData)

  const actorRef = useActorRef(machine, {
    input: {
      authorization,
      state: statement.assessment.evaluationStatus,
      evaluatorId: statement.assessment.evaluator?.id,
      statementType: statement.statementType,
      shortExplanation: statement.assessment.shortExplanation ?? '',
      longExplanation: statement.assessment.explanation ?? '',
      veracity: statement.assessment.veracity?.id,
      promiseRating: statement.assessment.promiseRating?.id,
    },
  })

  const isStatementFieldDisabled = useSelector(actorRef, (snapshot) => {
    const readOnly = { statementDetailsEditable: 'readOnly' as const }

    return (
      snapshot.matches({
        status: { being_evaluated: readOnly },
      }) ||
      snapshot.matches({
        status: { approval_needed: readOnly },
      }) ||
      snapshot.matches({
        status: {
          proofreading_needed: readOnly,
        },
      }) ||
      snapshot.matches({ status: 'approved' })
    )
  })

  const isStatementRatingDisabled = useSelector(actorRef, (snapshot) => {
    const readOnly = { statementRatingEditable: 'readOnly' as const }

    return (
      snapshot.matches({
        status: { being_evaluated: readOnly },
      }) ||
      snapshot.matches({
        status: { approval_needed: readOnly },
      }) ||
      snapshot.matches({
        status: {
          proofreading_needed: readOnly,
        },
      }) ||
      snapshot.matches({ status: 'approved' })
    )
  })

  const isStatementEvaluationVisible = useSelector(actorRef, (snapshot) => {
    const visible = { statementEvaluationVisibility: 'visible' as const }

    return (
      snapshot.matches({
        status: {
          being_evaluated: visible,
        },
      }) ||
      snapshot.matches({
        status: {
          approval_needed: visible,
        },
      }) ||
      snapshot.matches({
        status: {
          proofreading_needed: visible,
        },
      }) ||
      snapshot.matches({
        status: {
          approved: visible,
        },
      })
    )
  })

  const canBePublished = useSelector(actorRef, (snapshot) =>
    snapshot.matches({
      status: { approved: { statementPublishable: 'canBePublished' } },
    })
  )

  const canEditEvaluator = useSelector(actorRef, (snapshot) =>
    snapshot.matches({
      status: {
        being_evaluated: { statementEvaluatorEditable: 'editable' },
      },
    })
  )

  const isFactual = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ type: 'factual' })
  )

  const isPromise = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ type: 'promise' })
  )

  return useMemo(
    () => ({
      actorRef,
      isStatementEvaluationVisible,
      isStatementFieldDisabled,
      isStatementRatingDisabled,
      canEditEvaluator,
      canBePublished,
      isFactual,
      isPromise,
    }),
    [
      actorRef,
      isStatementEvaluationVisible,
      isStatementFieldDisabled,
      isStatementRatingDisabled,
      canEditEvaluator,
      canBePublished,
      isFactual,
      isPromise,
    ]
  )
}
