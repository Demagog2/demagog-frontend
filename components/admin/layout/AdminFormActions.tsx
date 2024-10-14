import { PropsWithChildren } from 'react'

export function AdminFormActions(props: PropsWithChildren) {
  return (
    <div className="flex items-center justify-end gap-x-6">
      {props.children}
    </div>
  )
}
