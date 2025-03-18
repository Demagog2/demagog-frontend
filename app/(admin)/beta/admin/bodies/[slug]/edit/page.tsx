import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminBodyForm } from '@/components/admin/bodies/AdminBodyForm'
import { editBody } from '../../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { body },
  } = await serverQuery({
    query: gql(`
      query AdminBodyEditMetadata($id: Int!) {
        body(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: Number(props.params.slug),
    },
  })

  return {
    title: getMetadataTitle(
      `Upravit stranu / skupinu: ${body.name}`,
      'Administrace'
    ),
  }
}

const AdminBodyEditQuery = gql(`
  query AdminBodyEdit($id: Int!) {
    body(id: $id) {
      id
      name
      ...AdminBodyData
    }
  }
`)

export default async function AdminBodyEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminBodyEditQuery,
    variables: {
      id: Number(props.params.slug),
    },
  })

  return (
    <AdminPage>
      <AdminBodyForm
        title={`Upravit stranu / skupinu: ${data.body.name}`}
        action={editBody.bind(null, data.body.id)}
        body={data.body}
      />
    </AdminPage>
  )
}
