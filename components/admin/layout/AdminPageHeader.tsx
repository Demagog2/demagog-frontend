import { PropsWithChildren } from 'react'

export function AdminPageHeader(props: PropsWithChildren) {
  return (
    <div className="pb-5 sm:flex sm:items-center sm:justify-between">
      {props.children}
    </div>
  )
}
