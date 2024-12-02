import { gql } from '@/__generated__'
import { AdminStatementForm } from '@/components/admin/sources/statements/AdminStatementForm'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createStatement } from '../../../actions'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { source },
  } = await serverQuery({
    query: gql(`
      query AdminSourceMetadata($id: Int!) {
        source(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: parseInt(props.params.slug, 10),
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
    <AdminStatementForm
      title="Přidat nový výrok"
      description="Ručně vložte či napište nový výrok"
      data={data}
      source={data.source}
      action={createStatement}
    />
  )
}
