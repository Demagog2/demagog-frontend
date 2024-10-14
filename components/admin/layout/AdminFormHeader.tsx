import { PropsWithChildren } from 'react'

export function AdminFormHeader(props: PropsWithChildren) {
  return (
    <div className="flex items-start justify-between">{props.children}</div>
  )
}
