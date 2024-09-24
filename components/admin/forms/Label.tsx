import { PropsWithChildren } from 'react'

export function Label(props: PropsWithChildren<{ htmlFor: string }>) {
  return (
    <label
      htmlFor={props.htmlFor}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {props.children}
    </label>
  )
}
