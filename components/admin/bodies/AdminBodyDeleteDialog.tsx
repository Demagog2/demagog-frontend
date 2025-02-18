'use client'

import { useCallback, useRef } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../layout/dialogs/AdminDeleteDialog'
import { deleteBody } from '@/app/(admin)/beta/admin/bodies/actions'

const AdminBodyDeleteFragment = gql(`
  fragment AdminBodyDelete on Body {
    id
    name
  }
`)

export default function AdminBodyDelete(props: {
  body: FragmentType<typeof AdminBodyDeleteFragment>
}) {
  const body = useFragment(AdminBodyDeleteFragment, props.body)

  const handleDeleteBody = useCallback(() => deleteBody(body.id), [body])

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      title="Smazat stranu / skupinu"
      description={
        <>
          Chcete opravdu smazat stranu / skupinu &quot;{body.name}&quot;? Tato
          akce je nevratná.
        </>
      }
      onDelete={handleDeleteBody}
    >
      <TrashIcon
        className="h-6 w-6 text-gray-400 hover:text-indigo-600"
        onClick={() => dialogRef.current?.openDialog()}
        title="Odstranit"
      />
    </AdminDeleteDialog>
  )
}
