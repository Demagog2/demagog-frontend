import classNames from 'classnames'
import { forwardRef, HTMLProps } from 'react'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  HTMLProps<HTMLTextAreaElement>
>(function Textarea(props: HTMLProps<HTMLTextAreaElement>, ref) {
  return (
    <textarea
      ref={ref}
      className={classNames(
        'block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6',
        {
          'focus:ring-2 focus:ring-inset focus:ring-indigo-600':
            !props.readOnly && !props.disabled,
        }
      )}
      {...props}
    />
  )
})
