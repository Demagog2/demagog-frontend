import { PropsWithChildren } from 'react'

export function AdminFormSidebar(
  props: PropsWithChildren<{ className?: string }>
) {
  return (
    <div className={props.className ?? 'col-1 col-span-12 lg:col-span-3'}>
      {props.children}
    </div>
  )
}
