import classNames from 'classnames'
import { PropsWithChildren } from 'react'

export function AdminFormSidebar(
  props: PropsWithChildren<{ className?: string }>
) {
  return (
    <div
      className={classNames(
        'min-w-[25%] w-[25%] content-start',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
