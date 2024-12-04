import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'
import { AdminAssessmentForm } from '@/components/admin/sources/statements/AdminAssessmentForm'
import { updateStatementAssessment } from '../../../actions'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'

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
    title: getMetadataTitle('Detail výroku', source.name, 'Administrace'),
  }
}

const AdminStatementDetailQuery = gql(`
  query AdminStatementDetail($id: Int!) {
    ...AdminAssessmentForm

    statementV2(id: $id, includeUnpublished: true) {
      ...AdminStatementAssessment
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
    <AdminAssessmentForm
      data={data}
      statement={data.statementV2}
      action={updateStatementAssessment.bind(null, props.params.id)}
    />
  )
}
