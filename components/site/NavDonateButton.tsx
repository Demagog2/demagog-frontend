'use client'

import { useShareableState } from '@/libs/useShareableState'
import { useBetween } from 'use-between'

export function NavDonateButton() {
  const { setDonateModal } = useBetween(useShareableState)

  return (
    <a className="btn bg-primary" onClick={() => setDonateModal(true)}>
      <span className="mx-2">Podpořte nás</span>
    </a>
  )
}
