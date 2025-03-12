import { PropsWithChildren } from 'react'

export function AdminPageContent(props: PropsWithChildren) {
  return (
    <div className="mt-8 flow-root px-4 sm:px-6 lg:px-8">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          {props.children}
        </div>
      </div>
    </div>
  )
}
