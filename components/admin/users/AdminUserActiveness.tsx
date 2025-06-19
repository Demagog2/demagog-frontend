'use client'

import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { updateUserActiveness } from '@/app/(admin)/beta/admin/users/actions'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const AdminUserActivenessFragment = gql(` 
  fragment AdminUserActiveness on User {
    id
    active
  }
`)

export function AdminUserActiveness(props: {
  user: FragmentType<typeof AdminUserActivenessFragment>
}) {
  const user = useFragment(AdminUserActivenessFragment, props.user)
  const router = useRouter()
  return (
    <button
      title={user.active ? 'Deaktivovat uživatele' : 'Aktivovat uživatele'}
      className="flex items-center space-x-1 text-sm text-gray-400 group"
      onClick={async () => {
        const result = await updateUserActiveness(Number(user.id), !user.active)

        if (result?.success) {
          router.refresh()
          toast.success(
            `Uživatel ${result.user?.fullName} byl úspěšně ${result.user?.active ? 'aktivován' : 'deaktivován'}.`
          )
        } else {
          toast.error('Došlo k chybě při deaktivaci / aktivaci uživatele.')
        }
      }}
    >
      <div className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 cursor-pointer">
        {user.active ? <XMarkIcon /> : <CheckIcon />}
      </div>

      <span className="group-hover:text-indigo-600">
        {user.active ? 'Deaktivovat' : 'Aktivovat'}
      </span>
    </button>
  )
}
