import { FragmentType, gql, useFragment } from '@/__generated__'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import { PropsWithChildren } from 'react'

const AuthorizeFragment = gql(`
  fragment Authorize on Query {
    ...Authorization
  }
`)

export function Authorize(
  props: PropsWithChildren<{
    permissions: string[]
    data: FragmentType<typeof AuthorizeFragment>
  }>
) {
  const data = useFragment(AuthorizeFragment, props.data)

  const { isAuthorized } = useAuthorization(data)

  return isAuthorized(props.permissions) && <>{props.children}</>
}
