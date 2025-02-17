import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'
import { AdminAssessmentFormController } from '@/components/admin/sources/statements/AdminAssessmentForm'
import { updateStatementAssessment } from '../../../actions'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { ApolloClientProvider } from '@/components/util/ApolloClientProvider'
import { getAuthorizationToken } from '@/libs/apollo-client'

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
    title: getMetadataTitle('Detail výroku', source.name, 'Administrace'),
  }
}

const AdminStatementDetailQuery = gql(`
  query AdminStatementDetail($id: Int!) {
    ...AdminAssessmentForm

    statementV2(id: $id, includeUnpublished: true) {
      id
    }
  }
`)

export default async function AdminStatementDetail(props: {
  params: { slug: string; id: string }
}) {
  const { data } = await serverQuery({
    query: AdminStatementDetailQuery,
    variables: {
      id: parseInt(props.params.id, 10),
    },
  })

  if (!data.statementV2) {
    notFound()
  }

  return (
    <ApolloClientProvider authorizationToken={getAuthorizationToken()}>
      <AdminAssessmentFormController
        data={data}
        statementId={parseInt(data.statementV2.id, 10)}
        action={updateStatementAssessment.bind(null, props.params.id)}
      />
    </ApolloClientProvider>
  )
}
