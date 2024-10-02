import Link from 'next/link'

type PageInfo = {
  hasPreviousPage: boolean
  hasNextPage: boolean
  startCursor?: string | null | undefined
  endCursor?: string | null | undefined
}

export function AdminPagination(props: { pageInfo: PageInfo }) {
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div className="flex flex-1 justify-between sm:justify-end">
        {props.pageInfo.hasPreviousPage && (
          <Link
            href={`?before=${props.pageInfo.startCursor}`}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Předchozí
          </Link>
        )}
        {props.pageInfo.hasNextPage && (
          <Link
            href={`?after=${props.pageInfo.endCursor}`}
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Další
          </Link>
        )}
      </div>
    </nav>
  )
}
