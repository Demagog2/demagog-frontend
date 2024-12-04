import { FragmentType, gql, useFragment } from '@/__generated__'
import { intersection } from 'lodash'
import { useCallback } from 'react'

const AuthorizationFragment = gql(`
  fragment Authorization on User {
    id
    role {
      permissions
    }
  }
`)

export function useAuthorization(
  user: FragmentType<typeof AuthorizationFragment>
) {
  const { role, id } = useFragment(AuthorizationFragment, user)

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
  }
}
