'use client'

import { useCallback, useRef } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteStatement } from '@/app/(admin)/beta/admin/sources/actions'
import truncate from '@/libs/truncate'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../../layout/dialogs/AdminDeleteDialog'
import { TrashIcon } from '@heroicons/react/24/outline'

const AdminStatementDeleteDialogFragment = gql(`
  fragment AdminStatementDeleteDialog on Statement {
    id
    content
    sourceSpeaker {
      fullName
    }
  }
`)

export default function AdminStatementDeleteDialog(props: {
  statement: FragmentType<typeof AdminStatementDeleteDialogFragment>
  sourceId: string
}) {
  const statement = useFragment(
    AdminStatementDeleteDialogFragment,
    props.statement
  )

  const handleDeleteStatement = useCallback(
    () => deleteStatement(props.sourceId, statement.id),
    [props.sourceId, statement]
  )

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      title="Smazat výrok"
      description={
        <>
          Chcete opravdu smazat výrok &bdquo;
          {truncate(statement.content, 50)}&rdquo; od{' '}
          {statement.sourceSpeaker.fullName}? Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteStatement}
      className="h-6 w-6 text-gray-400 hover:text-indigo-900 ml-3 cursor-pointer"
    >
      <TrashIcon
        onClick={() => dialogRef.current?.openDialog()}
        className="h-7 w-7 text-gray-400 hover:text-indigo-900 ml-3 cursor-pointer"
        title="Odstranit"
      />
    </AdminDeleteDialog>
  )
}
