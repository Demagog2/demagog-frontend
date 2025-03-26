import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminWorkshopForm } from '@/components/admin/workshops/AdminWorkshopForm'
import { updateWorkshop } from '../../actions'
import { notFound } from 'next/navigation'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { workshop },
  } = await serverQuery({
    query: gql(`
      query AdminWorkshopEditMetadata($id: ID!) {
        workshop(id: $id) {
          name
        }
      }
   `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(
      `Upravit workshop: ${workshop?.name}`,
      'Administrace'
    ),
  }
}

const AdminWorkshopEditQuery = gql(`
    query AdminWorkshopEdit($id: ID!) {
      workshop(id: $id) {
        id
        name
        ...AdminWorkshopData
      }
    }
  `)

export default async function AdminWorkshopEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminWorkshopEditQuery,
    variables: {
      id: props.params.slug,
    },
  })

  if (!data.workshop) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminWorkshopForm
        action={updateWorkshop.bind(null, data.workshop.id)}
        title={`Upravit workshop: ${data.workshop?.name}`}
        workshop={data.workshop}
      />
    </AdminPage>
  )
}
