'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useStatementFilters() {
  const [state, setState] = useState<any | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (!searchParams) {
      setState(null)
      return
    }

    if (searchParams.has('filter')) {
      setState(searchParams.get('filter'))
    }
  }, [searchParams])

  const onStatementsFilterUpdate = useCallback(
    (filter: string) => {
      setState(filter)

      // Make sure we update the url after the state is changed
      // so the location change listener can detect that the state
      // is already set
      router.push(`${pathname}?filter=${filter}`)
    },
    [pathname, router]
  )

  const onRemoveStatementsFilters = useCallback(() => {
    setState(null)

    // Reset the search part of location
    router.push(pathname ?? '')
  }, [pathname, router])

  return {
    state,
    onStatementsFilterUpdate,
    onRemoveStatementsFilters,
  }
}
