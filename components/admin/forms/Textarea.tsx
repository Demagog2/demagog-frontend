import { HTMLProps } from 'react'

export function Textarea(props: HTMLProps<HTMLTextAreaElement>) {
  return (
    <textarea
      className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      {...props}
    />
  )
}
