'use client'

import { useCallback, useRef } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteUser } from '@/app/(admin)/beta/admin/users/actions'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../layout/dialogs/AdminDeleteDialog'

const AdminUserDeleteFragment = gql(`
  fragment AdminUserDelete on User {
    id
    fullName
  }
`)

export default function AdminUserDelete(props: {
  user: FragmentType<typeof AdminUserDeleteFragment>
}) {
  const user = useFragment(AdminUserDeleteFragment, props.user)

  const handleDeleteUser = useCallback(() => deleteUser(user.id), [user])

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      title="Smazat uživatele"
      description={
        <>
          Chcete opravdu smazat uživatele &quot;{user.fullName}&quot;? Tato akce
          je nevratná.
        </>
      }
      onDelete={handleDeleteUser}
    >
      <TrashIcon
        className="h-6 w-6 text-gray-400 hover:text-indigo-600"
        onClick={() => dialogRef.current?.openDialog()}
        title="Odstranit"
      />
    </AdminDeleteDialog>
  )
}
