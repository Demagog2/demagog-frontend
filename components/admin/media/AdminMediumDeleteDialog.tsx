'use client'

import { useCallback } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteMedium } from '@/app/(admin)/beta/admin/media/actions'
import { AdminDeleteDialog } from '../layout/dialogs/AdminDeleteDialog'

const AdminMediumDeleteDialogFragment = gql(`
  fragment AdminMediumDeleteDialog on Medium {
    id
    name
  }
`)

export default function AdminMediumDeleteDialog(props: {
  medium: FragmentType<typeof AdminMediumDeleteDialogFragment>
  className?: string
}) {
  const medium = useFragment(AdminMediumDeleteDialogFragment, props.medium)

  const handleDeleteMedium = useCallback(
    () => deleteMedium(medium.id),
    [medium]
  )

  return (
    <AdminDeleteDialog
      title="Smazat pořad"
      description={
        <>
          Jste si opravdu jisti, že chcete smazat pořad &quot;
          {medium.name}&quot;? Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteMedium}
    />
  )
}
