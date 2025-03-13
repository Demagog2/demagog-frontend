import { PropsWithChildren } from 'react'

export function AdminFormHeader(props: PropsWithChildren) {
  return (
    <div className="flex items-start justify-between gap-x-4 px-4 sm:px-6 lg:px-8">
      {props.children}
    </div>
  )
}
