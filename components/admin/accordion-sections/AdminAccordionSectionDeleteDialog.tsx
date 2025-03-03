'use client'

import { useCallback } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteAccordionSection } from '@/app/(admin)/beta/admin/accordion-sections/actions'
import { AdminDeleteDialog } from '../layout/dialogs/AdminDeleteDialog'

const AdminAccordionSectionDeleteDialogFragment = gql(`
  fragment AdminAccordionSectionDeleteDialog on AccordionSection {
    id
    title
  }
`)

export default function AdminAccordionSectionDeleteDialog(props: {
  accordionSection: FragmentType<
    typeof AdminAccordionSectionDeleteDialogFragment
  >
  className?: string
}) {
  const accordionSection = useFragment(
    AdminAccordionSectionDeleteDialogFragment,
    props.accordionSection
  )
  const handleDeleteAccordionSection = useCallback(
    () => deleteAccordionSection(accordionSection.id),
    [accordionSection]
  )

  return (
    <AdminDeleteDialog
      title="Smazat sekci"
      className={props.className}
      description={
        <>
          Jste si opravdu jisti, že chcete smazat sekci &quot;
          {accordionSection.title}&quot;? Všechny informace budou trvale
          odstraněny. Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteAccordionSection}
    />
  )
}
