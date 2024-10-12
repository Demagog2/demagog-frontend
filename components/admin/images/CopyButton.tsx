'use client'

import { useState } from 'react'
import classNames from 'classnames'

export function CopyButton(props: { className?: string; link: string }) {
  const [label, setLabel] = useState('Kopírovat odkaz')

  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(props.link).then(
          () => {
            setLabel('Zkopírováno')
          },
          () => {
            setLabel('Došlo k chybě')
          }
        )
      }
      className={classNames(
        'relative w-full flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200',
        props.className
      )}
    >
      {label}
    </button>
  )
}
