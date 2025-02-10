'use client'

import { useCallback } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteStatement } from '@/app/(admin)/beta/admin/sources/actions'
import truncate from '@/libs/truncate'
import { AdminDeleteDialog } from '../../layout/dialogs/AdminDeleteDialog'

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

  return (
    <AdminDeleteDialog
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
    />
  )
}
