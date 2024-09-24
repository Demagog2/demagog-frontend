import { PropsWithChildren } from 'react'
import Link from 'next/link'

export function LinkButton(props: PropsWithChildren<{ href: string }>) {
  return (
    <Link
      href={props.href}
      className="text-sm font-semibold leading-6 text-gray-900"
    >
      {props.children}
    </Link>
  )
}
