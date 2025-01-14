import { PropsWithChildren } from 'react'
import { PencilIcon } from '@heroicons/react/24/outline'

export function Label(
  props: PropsWithChildren<{
    htmlFor: string
    isOptional?: boolean
    isDirty?: boolean
  }>
) {
  return (
    <div className="flex justify-between">
      <label
        htmlFor={props.htmlFor}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {props.children}
      </label>
      <div>
        {props.isOptional && (
          <span className="text-sm leading-6 text-gray-500">Volitelné</span>
        )}
        {props.isDirty && (
          <div
            title="Zobrazit rozdíl mezi verzemi"
            className="text-sm leading-6 text-indigo-500 flex items-center space-x-2"
          >
            <span>Upraveno</span>
            <PencilIcon className="size-4" />
          </div>
        )}
      </div>
    </div>
  )
}
