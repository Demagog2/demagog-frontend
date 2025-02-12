'use client'

import { useCallback, useRef } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../admin/layout/dialogs/AdminDeleteDialog'
import { deleteSpeaker } from '@/app/(admin)/beta/admin/speakers/actions'

const AdminSpeakerDeleteFragment = gql(`
  fragment AdminSpeakerDelete on Speaker {
    id
    fullName
  }
`)

export default function AdminSpeakerDelete(props: {
  speaker: FragmentType<typeof AdminSpeakerDeleteFragment>
  className?: string
}) {
  const speaker = useFragment(AdminSpeakerDeleteFragment, props.speaker)

  const handleDeleteSpeaker = useCallback(
    () => deleteSpeaker(speaker.id),
    [speaker]
  )

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      title="Smazat osobu"
      description={
        <>
          Jste si opravdu jisti, že chcete smazat osobu &quot;
          {speaker.fullName}&quot;? Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteSpeaker}
    >
      <TrashIcon
        className="h-6 w-6 text-gray-400 hover:text-indigo-600 cursor-pointer"
        onClick={() => dialogRef.current?.openDialog()}
        title="Odstranit"
      />
    </AdminDeleteDialog>
  )
}
