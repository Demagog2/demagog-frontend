'use client'

import { useCallback } from 'react'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteImage } from '@/app/(admin)/beta/admin/images/actions'
import { truncate } from 'lodash'
import { AdminDeleteDialog } from '../layout/dialogs/AdminDeleteDialog'

const AdminImageDeleteDialogFragment = gql(`
  fragment AdminImageDeleteDialog on ContentImage {
    id
    name
  }
`)

export function AdminImageDeleteDialog(props: {
  image: FragmentType<typeof AdminImageDeleteDialogFragment>
  className?: string
}) {
  const image = useFragment(AdminImageDeleteDialogFragment, props.image)

  const handleDeleteImage = useCallback(() => deleteImage(image.id), [image])

  return (
    <AdminDeleteDialog
      title="Smazat obrázek"
      className={props.className}
      description={
        <>
          Jste si opravdu jisti, že chcete smazat obrázek &quot;
          {truncate(image.name, { length: 50 })}&quot;? Pokud je obrázek
          součástí článku, bude místo obrázku zobrazen pouze alternativní text.
          Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteImage}
    />
  )
}
