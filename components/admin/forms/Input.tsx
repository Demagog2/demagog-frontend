import React, { forwardRef } from 'react'
import { Input as HeadlessInput } from '@headlessui/react'
import { UseFormRegister } from 'react-hook-form'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

export const Input = forwardRef<
  HTMLSelectElement,
  ReturnType<UseFormRegister<{}>> & { hasError?: boolean }
>(function Input(props, ref) {
  return (
    <div className="relative mt-2 rounded-md shadow-sm">
      <HeadlessInput
        ref={ref}
        className={classNames(
          'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
          {
            'text-red-900  ring-red-300  focus:ring-red-500 ': props.hasError,
          }
        )}
        aria-invalid={props.hasError}
        {...props}
      />
      {props.hasError && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ExclamationCircleIcon
            aria-hidden="true"
            className="h-5 w-5 text-red-500"
          />
        </div>
      )}
    </div>
  )
})
