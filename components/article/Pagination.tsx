'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { usePathname, useSearchParams } from 'next/navigation'

export const PaginationFragment = gql(`
    fragment PaginationFragment on PageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
    }
`)

/**
 * @deprecated Use `NumericalPagination` instead.
 */
export function Pagination(props: {
  pageInfo: FragmentType<typeof PaginationFragment>
}) {
  const pageInfo = useFragment(PaginationFragment, props.pageInfo)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createNextPage = (pageNumber: string) => {
    const params = new URLSearchParams(searchParams ?? '')
    params.set('after', pageNumber.toString())
    params.delete('before')
    return `${pathname}?${params.toString()}`
  }

  const createPrevPage = (pageNumber: string) => {
    const params = new URLSearchParams(searchParams ?? '')
    params.set('before', pageNumber.toString())
    params.delete('after')
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="col col-12">
      <div className="mb-10">
        {pageInfo.hasPreviousPage && (
          <a
            href={createPrevPage(pageInfo.startCursor ?? '')}
            className="btn h-50px fs-6 me-2 mb-2 px-8"
          >
            <span>Zobrazit předchozí</span>
          </a>
        )}
        {pageInfo.hasNextPage && (
          <a
            href={createNextPage(pageInfo.endCursor ?? '')}
            className="btn h-50px fs-6 me-2 mb-2 px-8"
          >
            <span>Zobrazit další</span>
          </a>
        )}
      </div>
    </div>
  )
}
