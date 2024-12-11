import classNames from 'classnames'
import { PropsWithChildren } from 'react'

export function AdminFormSidebar(
  props: PropsWithChildren<{ className?: string }>
) {
  return (
    <div
      className={classNames('col-1 col-span-12 lg:col-span-3', props.className)}
    >
      {props.children}
    </div>
  )
}
