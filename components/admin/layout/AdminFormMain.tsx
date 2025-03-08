import { PropsWithChildren } from 'react'

export function AdminFormMain(
  props: PropsWithChildren<{ className?: string }>
) {
  return (
    <div className={props.className ?? 'col-span-12 lg:col-span-9'}>
      {props.children}
    </div>
  )
}
