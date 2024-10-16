import { PropsWithChildren } from 'react'

export function AdminFormContent(props: PropsWithChildren) {
  return <div className="mt-6 flex gap-5 pb-12">{props.children}</div>
}
