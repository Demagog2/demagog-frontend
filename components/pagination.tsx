'use client'

import React, { useCallback, useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { paginate } from '@/libs/pagination'
import classNames from 'classnames'

export function Pagination({
  pageSize,
  currentPage,
  totalCount,
}: {
  pageSize: number
  currentPage: number
  totalCount: number
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createHref = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams ?? '')
      params.set('page', String(value))

      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  const totalPages = Math.ceil(totalCount / pageSize)

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  if (totalPages === 0 || totalPages === 1) {
    return null
  }

  const pages = useMemo(() => {
    return paginate({ currentPage, totalCount })
  }, [currentPage, totalPages])

  return (
    <nav className="pagination">
      <span className="prev">
        {!isFirstPage && (
          <Link href={createHref(currentPage - 1)} rel="prev">
            &lsaquo; Předchozí
          </Link>
        )}
      </span>

      {pages.map((page) => {
        if (page.type === 'gap') {
          return <span className="page gap">&hellip;</span>
        }

        return (
          <span
            className={classNames('page', {
              current: currentPage === page.value + 1,
            })}
          >
            <Link href={createHref(page.value + 1)}>{page.value + 1}</Link>
          </span>
        )
      })}

      <span className="next">
        {!isLastPage && (
          <Link href={createHref(currentPage + 1)} rel="next">
            Další &rsaquo;
          </Link>
        )}
      </span>
    </nav>
  )
}
