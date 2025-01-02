import { PropsWithChildren } from 'react'

export function AdminFormHeader(props: PropsWithChildren) {
  return (
    <div className="flex items-start justify-between gap-x-4">
      {props.children}
    </div>
  )
}
