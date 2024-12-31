'use client'

import { useRouter } from 'next/navigation'

import {
  markAsUnread,
  markAsRead,
} from '@/app/(admin)/beta/admin/notifications/actions'
import { gql, FragmentType, useFragment } from '@/__generated__'
import { SecondaryButton } from '../layout/buttons/SecondaryButton'

const ToggleReadButtonFragment = gql(`
  fragment ToggleReadButton on Notification {
    id
    isRead
  }
`)

export function ToggleReadButton(props: {
  notification: FragmentType<typeof ToggleReadButtonFragment>
}) {
  const notification = useFragment(ToggleReadButtonFragment, props.notification)

  const { isRead } = notification

  const router = useRouter() // Force refresh the page

  const handleToggle = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()

    if (isRead) {
      await markAsUnread(notification.id)
    } else {
      await markAsRead(notification.id)
    }

    router.refresh()
  }

  return (
    <SecondaryButton className="ml-3" onClick={handleToggle}>
      {!isRead ? 'Označit jako přečteno' : 'Označit jako nepřečteno'}
    </SecondaryButton>
  )
}
