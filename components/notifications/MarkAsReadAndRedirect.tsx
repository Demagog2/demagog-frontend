'use client'
import { useRouter } from 'next/navigation'

import { markAsReadAndRedirect } from '@/app/(admin)/beta/admin/notifications/actions'

export function MarkAsReadAndRedirect(props: { notificationId: string }) {
  const router = useRouter() // Force refresh the page

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          await markAsReadAndRedirect(props.notificationId)
          router.refresh()
        }}
      >
        Označ jako přečteno a přesměruj
      </button>
    </>
  )
}
