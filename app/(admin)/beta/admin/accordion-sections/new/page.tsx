import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminAccordionSectionForm } from '@/components/admin/accordion-sections/AdminAccordionSectionForm'
import { createAccordionSection } from '../actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nová sekce', 'Administrace'),
}

export default async function AddAccordionSectionNew() {
  return (
    <AdminAccordionSectionForm
      action={createAccordionSection}
      title="Nová sekce"
      description="Přidání nové sekce o nás"
    />
  )
}
