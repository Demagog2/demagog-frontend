'use client'

import { useCallback, useRef } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../layout/dialogs/AdminDeleteDialog'
import { deleteAccordionItem } from '@/app/(admin)/beta/admin/accordion-sections/actions'
import { TrashIcon } from '@heroicons/react/24/outline'

const AdminAccordionItemDeleteDialogFragment = gql(`
    fragment AdminAccordionItemDeleteDialog on AccordionItemV2 {
      ... on AccordionItemText {
        id
        title
      }
    }
  `)

export default function AdminAccordionItemDeleteDialog(props: {
  accordionItem: FragmentType<typeof AdminAccordionItemDeleteDialogFragment>
  accordionSection: string
  className?: string
}) {
  const accordionItem = useFragment(
    AdminAccordionItemDeleteDialogFragment,
    props.accordionItem
  )

  const { id: accordionItemId, title: accordionItemTitle } =
    accordionItem.__typename === 'AccordionItemText' ? accordionItem : {}

  const handleDeleteAccordionItem = useCallback(async () => {
    if (accordionItemId) {
      await deleteAccordionItem(accordionItemId, props.accordionSection)
    }
  }, [accordionItemId, props.accordionSection])

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      title="Smazat položku"
      className={props.className}
      description={
        <>
          Jste si opravdu jisti, že chcete smazat položku &quot;
          {accordionItemTitle}&quot;? Všechny informace budou trvale odstraněny.
          Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteAccordionItem}
    >
      <TrashIcon
        className="h-6 w-6 text-gray-400 hover:text-indigo-600 cursor-pointer"
        onClick={() => dialogRef.current?.openDialog()}
        title="Odstranit"
      />
    </AdminDeleteDialog>
  )
}
