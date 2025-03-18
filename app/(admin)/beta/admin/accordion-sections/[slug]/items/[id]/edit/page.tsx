import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { notFound } from 'next/navigation'
import { AdminAccordionItemForm } from '@/components/admin/accordion-items/AdminAccordionItemForm'
import { updateAccordionItem } from '../../../../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export async function generateMetadata(props: {
  params: { id: string }
}): Promise<Metadata> {
  const {
    data: { accordionItem },
  } = await serverQuery({
    query: gql(`
      query AdminAccordionItemEditMetadata($id: ID!) {
        accordionItem(id: $id) {
          title
        }  
      }
    `),
    variables: {
      id: props.params.id,
    },
  })

  return {
    title: getMetadataTitle(
      `Upravit položku: ${accordionItem?.title}`,
      'Administrace'
    ),
  }
}

const AdminAccordionItemEditQuery = gql(`
    query AdminAccordionItemEdit($id: ID!) {
      accordionItem(id: $id) {
        id
        title
        ...AdminAccordionItemData
        accordionSection {
          id
        }
      }
    }
  `)

export default async function AdminAccordionItemEdit(props: {
  params: { id: string }
}) {
  const { data } = await serverQuery({
    query: AdminAccordionItemEditQuery,
    variables: {
      id: props.params.id,
    },
  })

  if (!data.accordionItem) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminAccordionItemForm
        action={updateAccordionItem.bind(null, data.accordionItem.id)}
        title={`Upravit položku: ${data.accordionItem.title}`}
        accordionItem={data.accordionItem}
        sectionId={data.accordionItem?.accordionSection?.id}
      />
    </AdminPage>
  )
}
