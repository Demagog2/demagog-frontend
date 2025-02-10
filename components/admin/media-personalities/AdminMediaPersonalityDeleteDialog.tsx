'use client'

import { useCallback } from 'react'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteMediaPersonality } from '@/app/(admin)/beta/admin/moderators/actions'
import { AdminDeleteDialog } from '../layout/dialogs/AdminDeleteDialog'

const AdminMediaPersonalityDeleteDialogFragment = gql(`
  fragment AdminMediaPersonalityDeleteDialog on MediaPersonality {
    id
    name
  }
`)

export default function AdminMediaPersonalityDeleteDialog(props: {
  mediaPersonality: FragmentType<
    typeof AdminMediaPersonalityDeleteDialogFragment
  >
}) {
  const mediaPersonality = useFragment(
    AdminMediaPersonalityDeleteDialogFragment,
    props.mediaPersonality
  )

  const handleDeleteMediaPersonality = useCallback(
    () => deleteMediaPersonality(mediaPersonality.id),
    [mediaPersonality]
  )

  return (
    <AdminDeleteDialog
      title="Smazat moderátora"
      description={
        <>
          Jste si opravdu jisti, že chcete smazat moderátora &quot;
          {mediaPersonality.name}&quot;? Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteMediaPersonality}
    />
  )
}
