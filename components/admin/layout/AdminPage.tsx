import { PropsWithChildren } from 'react'

export function AdminPage(props: PropsWithChildren) {
  return <div className="px-4 sm:px-6 lg:px-8">{props.children}</div>
}
