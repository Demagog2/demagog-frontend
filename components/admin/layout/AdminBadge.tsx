import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

type AdminBadgeProps = PropsWithChildren<{
  className?: string
  onRemove?(evt: React.MouseEvent<HTMLButtonElement>): void
}>

export function AdminBadge(props: AdminBadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-x-0.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600',
        props.className
      )}
    >
      {props.children}

      {props.onRemove && (
        <button
          onMouseDown={props.onRemove}
          type="button"
          className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
        >
          <span className="sr-only">Odstranit</span>
          <svg
            viewBox="0 0 14 14"
            className="size-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75"
          >
            <path d="M4 4l6 6m0-6l-6 6" />
          </svg>
          <span className="absolute -inset-1" />
        </button>
      )}
    </span>
  )
}
