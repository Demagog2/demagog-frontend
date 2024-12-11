import { PropsWithChildren } from 'react'
import classNames from 'classnames'

export function AdminFormContent(
  props: PropsWithChildren<{ className?: string }>
) {
  return (
    <div
      className={classNames(
        'mt-6 grid grid-cols-12 gap-5 pb-12',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
