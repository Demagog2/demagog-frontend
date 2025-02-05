'use client'

import React, { useCallback, useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
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

  const pages = useMemo(
    () => paginate({ currentPage: currentPage - 1, totalPages }),
    [currentPage, totalPages]
  )

  if (totalPages === 0 || totalPages === 1) {
    return null
  }

  return (
    <nav className="pagination">
      <span className="prev">
        {!isFirstPage && (
          <a href={createHref(currentPage - 1)} rel="prev">
            &lsaquo; Předchozí
          </a>
        )}
      </span>

      {pages.map((page, i) => {
        if (page.type === 'gap') {
          return (
            <span key={`gap-${i}`} className="page gap">
              &hellip;
            </span>
          )
        }

        return (
          <span
            key={page.value}
            className={classNames('page', {
              current: currentPage === page.value + 1,
            })}
          >
            <a href={createHref(page.value + 1)}>{page.value + 1}</a>
          </span>
        )
      })}

      <span className="next">
        {!isLastPage && (
          <a href={createHref(currentPage + 1)} rel="next">
            Další &rsaquo;
          </a>
        )}
      </span>
    </nav>
  )
}
