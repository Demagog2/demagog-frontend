import classNames from 'classnames'
import { PropsWithChildren } from 'react'

export function AdminFormMain(
  props: PropsWithChildren<{ className?: string }>
) {
  return (
    <div className={classNames('grow', props.className)}>{props.children}</div>
  )
}
