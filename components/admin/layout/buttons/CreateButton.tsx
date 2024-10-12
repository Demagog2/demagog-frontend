import Link from 'next/link'
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import { PropsWithChildren } from 'react'

export function CreateButton(props: PropsWithChildren<{ href: string }>) {
  return (
    <Link
      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      href={props.href}
    >
      <PlusCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
      {props.children}
    </Link>
  )
}
