import { Button } from '@headlessui/react'
import classNames from 'classnames'

export function AdminSegmentSelector(props: {
  segments: {
    segmentType: string
    title: string
    description: string
    background: string
    icon: any
    onClick(): void
  }[]
}) {
  return (
    <div>
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Obsah článku
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Vyberte textový nebo výrokový segment článku.
      </p>
      <ul
        role="list"
        className="mt-6 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2"
      >
        {props.segments.map((segment) => (
          <li key={segment.segmentType} className="flow-root">
            <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
              <div
                className={classNames(
                  segment.background,
                  'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'
                )}
              >
                <segment.icon
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  <Button
                    type="button"
                    onClick={segment.onClick}
                    className="focus:outline-none"
                  >
                    <span aria-hidden="true" className="absolute inset-0" />
                    <span>{segment.title}</span>
                    <span aria-hidden="true"> &rarr;</span>
                  </Button>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {segment.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
