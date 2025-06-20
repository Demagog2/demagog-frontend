'use client'

import { markAllNotificationsAsRead } from '@/app/(admin)/beta/admin/notifications/actions'
import { SecondaryButton } from '../layout/buttons/SecondaryButton'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export function MarkAllAsRead() {
  const router = useRouter()

  return (
    <SecondaryButton
      onClick={async () => {
        try {
          const result = await markAllNotificationsAsRead()
          if (result.success) {
            router.refresh()
          } else {
            toast('Nepodařilo se označit notifikace jako přečtené')
          }
        } catch (error) {
          console.error('Chyba při označování notifikací jako přečtené:', error)
          toast.error('Došlo k chybě při označení notifikací jako přečtené')
        }
      }}
      icon={<CheckIcon />}
    >
      Označit vše jako přečtené
    </SecondaryButton>
  )
}
