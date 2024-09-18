import { PropsWithChildren } from 'react'

export function Authorize(props: PropsWithChildren<{ permissions: string[] }>) {
  return <>{props.children}</>
}
