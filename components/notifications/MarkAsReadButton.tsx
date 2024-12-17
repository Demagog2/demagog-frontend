'use client'
import { useRouter } from 'next/navigation'

import {
  markAsReadAndRedirect,
  markAsUnread,
} from '@/app/(admin)/beta/admin/notifications/actions'
import { Button } from '@headlessui/react'

export function MarkAsReadButton(props: { notificationId: string }) {
  const router = useRouter() // Force refresh the page

  return (
    <Button
      type="button"
      className="text-indigo-600 hover:text-indigo-900 ml-3"
      onClick={async () => {
        await markAsUnread(props.notificationId)
        router.refresh()
      }}
    >
      Označit jako --TODO--
    </Button>
  )
}
