import { PropsWithChildren } from 'react'

export function AdminPageHeader(props: PropsWithChildren) {
  return (
    <div className="pb-5 px-4 sm:px-6 lg:px-8 sm:flex sm:items-center sm:justify-between">
      {props.children}
    </div>
  )
}
