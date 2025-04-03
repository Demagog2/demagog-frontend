'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useStatementFilters() {
  const [state, setState] = useState<string[]>([])
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (!searchParams) {
      setState([])
      return
    }

    const filters = searchParams.getAll('filter')
    setState(filters)
  }, [searchParams])

  const onStatementsFilterUpdate = useCallback(
    (filter: string) => {
      const newFilters = state.includes(filter)
        ? state.filter((f) => f !== filter)
        : [...state, filter]

      setState(newFilters)

      // Update URL with all filters
      const params = new URLSearchParams()
      newFilters.forEach((f) => params.append('filter', f))
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, state]
  )

  const onRemoveStatementsFilters = useCallback(() => {
    setState([])
    router.push(pathname ?? '')
  }, [pathname, router])

  return {
    state,
    onStatementsFilterUpdate,
    onRemoveStatementsFilters,
  }
}
