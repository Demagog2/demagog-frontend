import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

export function AlertMessage(props: {
  title: string
  message: string
  onClose?(): void
  className?: string
}) {
  return (
    <div
      className={classNames(
        'flex items-center gap-x-6 bg-indigo-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1',
        props.className
      )}
    >
      <p className="text-sm leading-6 text-white">
        <strong className="font-semibold">{props.title}</strong>
        <svg
          viewBox="0 0 2 2"
          aria-hidden="true"
          className="mx-2 inline h-0.5 w-0.5 fill-current"
        >
          <circle r={1} cx={1} cy={1} />
        </svg>
        {props.message}
      </p>
      <div className="flex flex-1 justify-end">
        {props.onClose && (
          <button
            type="button"
            className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
            onClick={props.onClose}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon aria-hidden="true" className="h-5 w-5 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
