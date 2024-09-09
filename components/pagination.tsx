'use client'

import React, { useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
      const params = new URLSearchParams(searchParams)
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

  return (
    <nav className="pagination">
      <span className="prev">
        {!isFirstPage && (
          <Link href={createHref(currentPage - 1)} rel="prev">
            &lsaquo; Předchozí
          </Link>
        )}
      </span>

      {Array.from(Array(totalPages).keys()).map((i) => (
        <span
          key={i}
          className={`page${currentPage === i + 1 ? ' current' : ''}`}
        >
          <Link href={createHref(i + 1)}>{i + 1}</Link>
        </span>
      ))}

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
