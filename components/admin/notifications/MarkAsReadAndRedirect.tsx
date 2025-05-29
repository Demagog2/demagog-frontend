'use client'
import { useRouter } from 'next/navigation'

import { markAsReadAndRedirect } from '@/app/(admin)/beta/admin/notifications/actions'
import { SecondaryButton } from '../layout/buttons/SecondaryButton'

export function MarkAsReadAndRedirect(props: { notificationId: string }) {
  const router = useRouter() // Force refresh the page

  return (
    <>
      <SecondaryButton
        type="button"
        onClick={async () => {
          await markAsReadAndRedirect(props.notificationId)
          router.refresh()
        }}
      >
        Označ jako přečteno a přesměruj
      </SecondaryButton>
    </>
  )
}
