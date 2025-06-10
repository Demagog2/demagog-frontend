import classNames from 'classnames'
import { HTMLAttributeAnchorTarget, PropsWithChildren } from 'react'

export function SecondaryLinkButton(
  props: PropsWithChildren<{
    href: string
    icon?: React.ReactNode
    iconClassName?: string
    className?: string
    rel?: string
    target?: HTMLAttributeAnchorTarget
  }>
) {
  return (
    <a
      href={props.href}
      className={classNames(
        'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        props.className
      )}
      rel={props.rel}
      target={props.target}
    >
      {props.icon && (
        <span
          className={classNames(
            '-ml-0.5 mr-1.5 h-5 w-5 text-gray-400',
            props.iconClassName
          )}
          aria-hidden="true"
        >
          {props.icon}
        </span>
      )}
      {props.children}
    </a>
  )
}
