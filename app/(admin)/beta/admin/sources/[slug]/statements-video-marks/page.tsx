import { gql } from '@/__generated__'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminVideoSourceForm } from '@/components/admin/sources/video-marks/AdminVideoSourceForm'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { updateSourceVideoFields, updateStatementVideoMarks } from './actions'
import { AdminVideoStatementMarksForm } from '@/components/admin/sources/video-marks/AdminVideoStatementMarksForm'

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
    title: getMetadataTitle(
      'Propojení videozáznamu',
      source.name,
      'Administrace'
    ),
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function AdminSourceStatementsVideoMarks({
  params,
}: PageProps) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminSourceStatementsVideoMarks($id: ID!) {
        sourceV2(id: $id) {
          name
          videoType
          videoId
          ...AdminVideoSourceForm
          ...AdminVideoStatementMarksForm
        }
      }
    `),
    variables: { id: params.slug },
  })

  if (!data?.sourceV2) {
    notFound()
  }

  const source = data.sourceV2

  const hasVideo = !!source.videoType && !!source.videoId

  return (
    <AdminPage>
      {hasVideo ? (
        <AdminVideoStatementMarksForm
          source={source}
          action={updateStatementVideoMarks.bind(null, params.slug)}
        />
      ) : (
        <AdminVideoSourceForm
          source={source}
          action={updateSourceVideoFields.bind(null, params.slug)}
        />
      )}
    </AdminPage>
  )
}
