import classNames from 'classnames'
import { Button, ButtonProps } from '@headlessui/react'
import React, { PropsWithChildren } from 'react'

type IconPosition = 'left' | 'right'

interface SecondaryButtonProps extends ButtonProps {
  icon?: React.ReactNode
  iconPosition?: IconPosition
  iconClassName?: string
}

export function SecondaryButton(
  props: PropsWithChildren<SecondaryButtonProps>
) {
  const {
    icon,
    iconPosition = 'left',
    iconClassName,
    className,
    ...rest
  } = props

  return (
    <Button
      className={classNames(
        'inline-flex items-center justify-center rounded-md bg-white disabled:text-gray-600 disabled:cursor-not-allowed disabled:bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto',
        { 'gap-x-1.5 flex-shrink-0': icon },
        className
      )}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <span
          className={classNames('h-5 w-5 text-gray-400', iconClassName)}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {props.children}
      {icon && iconPosition === 'right' && (
        <span
          className={classNames('h-5 w-5 text-gray-400', iconClassName)}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </Button>
  )
}
