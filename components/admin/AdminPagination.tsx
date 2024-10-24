'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type PageInfo = {
  hasPreviousPage: boolean
  hasNextPage: boolean
  startCursor?: string | null | undefined
  endCursor?: string | null | undefined
}

export function AdminPagination(props: { pageInfo: PageInfo }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { startCursor, endCursor } = props.pageInfo

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
        {props.pageInfo.hasPreviousPage && (
          <Link
            href={beforeLink}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Předchozí
          </Link>
        )}
        {props.pageInfo.hasNextPage && (
          <Link
            href={afterLink}
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Další
          </Link>
        )}
      </div>
    </nav>
  )
}
