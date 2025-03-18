import { AdminSourceForm } from '@/components/admin/sources/AdminSourceForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { serverQuery } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { updateSource } from '../../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { source },
  } = await serverQuery({
    query: gql(`
       query AdminSourceEditMedatada($id: Int!) {
          source(id: $id) {
            name
          }
        }
      `),
    variables: {
      id: Number(props.params.slug),
    },
  })

  return {
    title: getMetadataTitle(`Upravit ${source.name}`, 'Administrace'),
  }
}

const AdminSourceEditQuery = gql(`
    query AdminSourceEdit($id: Int!) {
      ...AdminSourceForm
      source(id: $id) {
        name
        ...AdminSourceData
      }
    }
`)

export default async function AdminSourcEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminSourceEditQuery,
    variables: {
      id: Number(props.params.slug),
    },
  })

  return (
    <AdminPage>
      <AdminSourceForm
        title={`Upravit diskuzi - ${data.source.name}`}
        description={'Upravit diskuzi pro ověřování výroků.'}
        data={data}
        source={data.source}
        action={updateSource.bind(null, props.params.slug)}
      />
    </AdminPage>
  )
}
