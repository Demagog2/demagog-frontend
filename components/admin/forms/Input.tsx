import React, { forwardRef } from 'react'
import { Input as HeadlessInput } from '@headlessui/react'
import { UseFormRegister } from 'react-hook-form'

export const Input = forwardRef<
  HTMLSelectElement,
  ReturnType<UseFormRegister<{}>>
>(function Input(props, ref) {
  return (
    <HeadlessInput
      ref={ref}
      className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      {...props}
    />
  )
})
