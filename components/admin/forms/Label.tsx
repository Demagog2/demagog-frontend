import { PropsWithChildren } from 'react'

export function Label(
  props: PropsWithChildren<{ htmlFor: string; isOptional?: boolean }>
) {
  return (
    <div className="flex justify-between">
      <label
        htmlFor={props.htmlFor}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {props.children}
      </label>
      {props.isOptional && (
        <span className="text-sm leading-6 text-gray-500">Volitelné</span>
      )}
    </div>
  )
}
