import { PropsWithChildren } from 'react'
import classNames from 'classnames'

export function LinkButton(
  props: PropsWithChildren<{ href: string; className?: string }>
) {
  return (
    <a
      href={props.href}
      className={classNames(
        'text-sm font-semibold leading-6 text-gray-900',
        props.className
      )}
    >
      {props.children}
    </a>
  )
}
