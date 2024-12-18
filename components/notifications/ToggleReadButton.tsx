'use client'
import { useRouter } from 'next/navigation'

import {
  markAsReadAndRedirect,
  markAsUnread,
} from '@/app/(admin)/beta/admin/notifications/actions'
import { Button } from '@headlessui/react'

export function ToggleReadButton(props: {
  notificationId: string
  isRead: string | null
}) {
  const router = useRouter() // Force refresh the page

  const handleToggle = async () => {
    if (props.isRead === null) {
      await markAsReadAndRedirect(props.notificationId)
    } else {
      await markAsUnread(props.notificationId)
    }
    router.refresh()
  }

  return (
    <Button
      type="button"
      className="text-indigo-600 hover:text-indigo-900 ml-3"
      onClick={handleToggle}
    >
      {props.isRead === null
        ? 'Označit jako přečteno'
        : 'Označit jako nepřečteno'}
    </Button>
  )
}
