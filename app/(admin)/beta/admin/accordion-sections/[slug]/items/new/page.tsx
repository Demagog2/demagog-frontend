import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminAccordionItemForm } from '@/components/admin/accordion-items/AdminAccordionItemForm'
import { createAccordionItem } from '../../../actions'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: getMetadataTitle('Nová položka', 'Administrace'),
}

const AdminAccordionItemNewQuery = gql(`
    query AdminAccordionItemNew($id: ID!) {
      accordionSection(id: $id) {
        id
        title
      }
    }
  `)

export default async function AddAccordionItemNew(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminAccordionItemNewQuery,
    variables: {
      id: props.params.slug,
    },
  })

  if (!data.accordionSection) {
    notFound()
  }

  return (
    <AdminAccordionItemForm
      action={createAccordionItem}
      title="Nová položka"
      description={`Přidání nové položky do sekce: ${data.accordionSection.title}`}
      sectionId={data.accordionSection.id}
    />
  )
}
