import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { notFound } from 'next/navigation'
import { AdminAccordionSectionForm } from '@/components/admin/accordion-sections/AdminAccordionSectionForm'
import { updateAccordionSection } from '../../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { accordionSection },
  } = await serverQuery({
    query: gql(`
      query AdminAccordionSectionEditMetadata($id: ID!) {
        accordionSection(id: $id) {
          title
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(
      `Upravit sekci: ${accordionSection?.title}`,
      'Administrace'
    ),
  }
}

const AdminAccordionSectionEditQuery = gql(`
  query AdminAccordionSectionEdit($id: ID!) {
    accordionSection(id: $id) {
      id
      title
      ...AdminAccordionSectionData
    }
  }
`)

export default async function AdminAccordionSectionEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminAccordionSectionEditQuery,
    variables: {
      id: props.params.slug,
    },
  })

  if (!data.accordionSection) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminAccordionSectionForm
        action={updateAccordionSection.bind(null, data.accordionSection.id)}
        title={`Upravit sekci: ${data.accordionSection?.title}`}
        accordionSection={data.accordionSection}
      />
    </AdminPage>
  )
}
