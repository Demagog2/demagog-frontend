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
    },
  })

  const isStatementEvaluationVisible = useSelector(actorRef, (snapshot) => {
    return (
      snapshot.matches({
        status: {
          being_evaluated: { statementEvaluationVisibility: 'visible' },
        },
      }) &&
      snapshot.matches({
        status: {
          approval_needed: { statementEvaluationVisibility: 'visible' },
        },
      }) &&
      snapshot.matches({
        status: {
          proofreading_needed: { statementEvaluationVisibility: 'visible' },
        },
      }) &&
      snapshot.matches({
        status: {
          approved: { statementEvaluationVisibility: 'visible' },
        },
      })
    )
  })

  const isStatementFieldDisabled = useSelector(actorRef, (snapshot) => {
    return (
      snapshot.matches({
        status: { being_evaluated: { statementDetailsEditable: 'readOnly' } },
      }) ||
      snapshot.matches({
        status: { approval_needed: { statementDetailsEditable: 'readOnly' } },
      }) ||
      snapshot.matches({
        status: {
          proofreading_needed: { statementDetailsEditable: 'readOnly' },
        },
      }) ||
      snapshot.matches({ status: 'approved' })
    )
  })

  const isStatementRatingDisabled = useSelector(actorRef, (snapshot) => {
    return (
      snapshot.matches({
        status: { being_evaluated: { statementRatingEditable: 'readOnly' } },
      }) ||
      snapshot.matches({
        status: { approval_needed: { statementRatingEditable: 'readOnly' } },
      }) ||
      snapshot.matches({
        status: {
          proofreading_needed: { statementRatingEditable: 'readOnly' },
        },
      }) ||
      snapshot.matches({ status: 'approved' })
    )
  })

  const isFactual = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ type: 'factual' })
  )

  const isPromise = useSelector(actorRef, (snapshot) =>
    snapshot.matches({ type: 'promise' })
  )

  return useMemo(
    () => ({
      isStatementEvaluationVisible,
      isStatementFieldDisabled,
      isStatementRatingDisabled,
      isFactual,
      isPromise,
    }),
    [
      isStatementEvaluationVisible,
      isStatementFieldDisabled,
      isStatementRatingDisabled,
      isFactual,
      isPromise,
    ]
  )
}
