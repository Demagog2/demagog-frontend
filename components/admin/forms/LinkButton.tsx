import { type HTMLAttributeAnchorTarget, PropsWithChildren } from 'react'
import classNames from 'classnames'

export function LinkButton(
  props: PropsWithChildren<{
    href: string
    className?: string
    rel?: string
    target?: HTMLAttributeAnchorTarget
  }>
) {
  return (
    <a
      href={props.href}
      className={classNames(
        'text-sm font-semibold leading-6 text-gray-900',
        props.className
      )}
      rel={props.rel}
      target={props.target}
    >
      {props.children}
    </a>
  )
}
