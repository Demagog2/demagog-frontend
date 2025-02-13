import { FragmentType, gql, useFragment } from '@/__generated__'
import { intersection } from 'lodash'

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

export function useAuthorizationServer(
  data: FragmentType<typeof AuthorizationFragment>
) {
  const {
    currentUser: { role },
  } = useFragment(AuthorizationFragment, data)

  return (permissionsNeeded: string[]) => {
    return intersection(role.permissions, permissionsNeeded).length > 0
  }
}
