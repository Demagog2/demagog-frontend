import { PropsWithChildren } from 'react'

export function LinkButton(props: PropsWithChildren<{ href: string }>) {
  return (
    <a
      href={props.href}
      className="text-sm font-semibold leading-6 text-gray-900"
    >
      {props.children}
    </a>
  )
}
