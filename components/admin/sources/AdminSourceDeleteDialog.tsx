'use client'

import { useCallback } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteSource } from '@/app/(admin)/beta/admin/sources/actions'
import { AdminDeleteDialog } from '../layout/dialogs/AdminDeleteDialog'

const AdminSourceDeleteFragment = gql(`
  fragment AdminSourceDelete on Source {
    id
    name
  }
`)

export default function AdminSourceDeleteDialog(props: {
  source: FragmentType<typeof AdminSourceDeleteFragment>
}) {
  const source = useFragment(AdminSourceDeleteFragment, props.source)

  const handleDeleteUser = useCallback(() => deleteSource(source.id), [source])

  return (
    <AdminDeleteDialog
      title="Smazat diskuzi"
      className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      description={
        <>
          Chcete opravdu smazat diskuzi &quot;{source.name}&quot;? Tato akce je
          nevratná.
        </>
      }
      onDelete={handleDeleteUser}
    />
  )
}
