import classNames from 'classnames'
import { PropsWithChildren } from 'react'

export function AdminFormMain(
  props: PropsWithChildren<{ className?: string }>
) {
  return (
    <div className={classNames('col-span-12 lg:col-span-9', props.className)}>
      {props.children}
    </div>
  )
}
