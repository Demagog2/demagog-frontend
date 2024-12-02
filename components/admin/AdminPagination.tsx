'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const AdminPaginationFragment = gql(`
  fragment AdminPagination on PageInfo {
      hasPreviousPage
      hasNextPage
      endCursor
      startCursor
    }
  `)

export function AdminPagination(props: {
  pageInfo: FragmentType<typeof AdminPaginationFragment>
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageInfo = useFragment(AdminPaginationFragment, props.pageInfo)

  const { startCursor, endCursor } = pageInfo

  const beforeLink = useMemo(() => {
    const params = new URLSearchParams(searchParams ?? '')
    params.delete('after')
    params.set('before', startCursor ?? '')

    return `${pathname}?${params.toString()}`
  }, [pathname, searchParams, startCursor])

  const afterLink = useMemo(() => {
    const params = new URLSearchParams(searchParams ?? '')
    params.delete('before')
    params.set('after', endCursor ?? '')

    return `${pathname}?${params.toString()}`
  }, [pathname, searchParams, endCursor])

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div className="flex flex-1 justify-between sm:justify-end mt-2">
        {pageInfo.hasPreviousPage && (
          <a
            href={beforeLink}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Předchozí
          </a>
        )}
        {pageInfo.hasNextPage && (
          <a
            href={afterLink}
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Další
          </a>
        )}
      </div>
    </nav>
  )
}
