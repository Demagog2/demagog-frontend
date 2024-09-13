import classNames from 'classnames'
import { PropsWithChildren } from 'react'

export function Article(props: PropsWithChildren<{ pinned: boolean }>) {
  return (
    <article
      className={classNames('col s-article', {
        'bg-light rounded py-5': props.pinned,
      })}
    >
      {props.children}
    </article>
  )
}
