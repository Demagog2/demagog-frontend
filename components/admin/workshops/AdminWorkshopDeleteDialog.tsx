'use client'

import { useCallback, useRef } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteWorkshop } from '@/app/(admin)/beta/admin/workshops/actions'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../layout/dialogs/AdminDeleteDialog'

const AdminWorkshopDeleteFragment = gql(`
    fragment AdminWorkshopDelete on Workshop {
      id
      name
    }
  `)

export default function AdminWorkshopDelete(props: {
  workshop: FragmentType<typeof AdminWorkshopDeleteFragment>
}) {
  const workshop = useFragment(AdminWorkshopDeleteFragment, props.workshop)

  const handleDeleteWorkshop = useCallback(
    () => deleteWorkshop(workshop.id),
    [workshop]
  )

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      title="Smazat workshop"
      description={
        <>
          Chcete opravdu smazat workshop &quot;{workshop.name}&quot;? Tato akce
          je nevratná.
        </>
      }
      onDelete={handleDeleteWorkshop}
    ></AdminDeleteDialog>
  )
}
