import { AdminTagHeader } from '@/components/admin/tags/AdminTagHeader'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'
import { AdminPage } from '@/components/admin/layout/AdminPage'

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
