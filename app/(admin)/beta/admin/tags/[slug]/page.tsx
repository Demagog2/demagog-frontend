import { AdminTagHeader } from '@/components/admin/tags/AdminTagHeader'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { tag },
  } = await serverQuery({
    query: gql(`
      query AdminTagDetailMetadata($id: ID!) {
        tag(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(`Detail tagu: ${tag?.name}`, 'Administrace'),
  }
}

const TagQuery = gql(`
  query AdminTag($id: ID!) {
    tag(id: $id) {
      id
      ...AdminTagHeader
    }
  }
`)

export default async function AdminTagDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: TagQuery,
    variables: {
      id: props.params.slug,
    },
  })

  if (!data.tag) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminTagHeader tag={data.tag} />
    </AdminPage>
  )
}
