'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { usePathname, useSearchParams } from 'next/navigation'

export const NumericalPaginationFragment = gql(`
    fragment NumericalPagination on PageInfo {
        hasNextPage
        hasPreviousPage
    }
`)

export function NumericalPagination(props: {
  pageInfo: FragmentType<typeof NumericalPaginationFragment>
  page: number
}) {
  const pageInfo = useFragment(NumericalPaginationFragment, props.pageInfo)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createNextPage = () => {
    const params = new URLSearchParams(searchParams ?? '')
    params.set('page', (props.page + 1).toString())
    return `${pathname}?${params.toString()}`
  }

  const createPrevPage = () => {
    const params = new URLSearchParams(searchParams ?? '')
    params.set('page', (props.page - 1).toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="col col-12">
      <div className="mb-10">
        {pageInfo.hasPreviousPage && (
          <a href={createPrevPage()} className="btn h-50px fs-6 me-2 mb-2 px-8">
            <span>Zobrazit předchozí</span>
          </a>
        )}
        {pageInfo.hasNextPage && (
          <a href={createNextPage()} className="btn h-50px fs-6 me-2 mb-2 px-8">
            <span>Zobrazit další</span>
          </a>
        )}
      </div>
    </div>
  )
}
