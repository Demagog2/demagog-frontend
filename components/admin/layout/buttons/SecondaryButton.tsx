import classNames from 'classnames'
import { Button, ButtonProps } from '@headlessui/react'

export function SecondaryButton(props: ButtonProps) {
  const { className, ...rest } = props
  return (
    <Button
      className={classNames(
        'rounded-md bg-white disabled:text-gray-600 disabled:cursor-not-allowed disabled:bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        className
      )}
      {...rest}
    >
      {props.children}
    </Button>
  )
}
