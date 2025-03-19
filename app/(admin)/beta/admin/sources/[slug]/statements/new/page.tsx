import { gql } from '@/__generated__'
import { AdminStatementForm } from '@/components/admin/sources/statements/AdminStatementForm'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createStatement } from '../../../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { sourceV2: source },
  } = await serverQuery({
    query: gql(`
      query AdminSourceMetadata($id: ID!) {
        sourceV2(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  if (!source) {
    notFound()
  }

  return {
    title: getMetadataTitle('Nový výrok', source.name, 'Administrace'),
  }
}

const AdminNewStatementQuery = gql(`
  query AdminNewStatement($id: Int!) {
    ...AdminStatementForm
    source(id: $id) {
      ...AdminStatementSourceDetailsForm
    }
  }
`)

export default async function AdminNewStatement(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminNewStatementQuery,
    variables: {
      id: Number(props.params.slug),
    },
  })

  if (!data.source) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminStatementForm
        title="Přidat nový výrok"
        description="Ručně vložte či napište nový výrok"
        data={data}
        source={data.source}
        action={createStatement}
      />
    </AdminPage>
  )
}
