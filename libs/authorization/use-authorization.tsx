import { FragmentType, gql, useFragment } from '@/__generated__'
import { intersection } from 'lodash'
import { useCallback } from 'react'

const AuthorizationFragment = gql(`
  fragment Authorization on Query {
    currentUser {
      id
      role {
        permissions
      }
    }
  }
`)

export function useAuthorization(
  data: FragmentType<typeof AuthorizationFragment>
) {
  const {
    currentUser: { role, id },
  } = useFragment(AuthorizationFragment, data)

  const isAuthorized = useCallback(
    (permissionsNeeded: string[]) => {
      return intersection(role.permissions, permissionsNeeded).length > 0
    },
    [role]
  )

  const canEditStatement = useCallback(
    () => isAuthorized(['statements:edit']),
    [isAuthorized]
  )

  const canEditStatementAsProofreader = useCallback(
    () => isAuthorized(['statements:edit-as-proofreader']),
    [isAuthorized]
  )

  const canViewUnapprovedEvaluation = useCallback(
    () => isAuthorized(['statements:view-unapproved-evaluation']),
    [isAuthorized]
  )

  const canEditStatementAsEvaluator = useCallback(
    (evaluatorId: string) =>
      evaluatorId === id && isAuthorized(['statements:edit-as-evaluator']),
    [isAuthorized, id]
  )

  return {
    isAuthorized,
    canEditStatement,
    canEditStatementAsEvaluator,
    canEditStatementAsProofreader,
    canViewUnapprovedEvaluation,
  }
}
