import { gql } from '@/__generated__'
import { AdminSourceHeader } from '@/components/admin/sources/AdminSourceHeader'
import { AdminSourcesFilters } from '@/components/admin/sources/AdminSourcesFilters'
import { serverQuery } from '@/libs/apollo-client-server'

export default async function AdminSource(props: { params: { slug: string } }) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminSource($id: Int!) {
        source(id: $id) {
          ...AdminSourceHeader
          ...AdminSourcesFilters
        }
      }
    `),
    variables: {
      id: parseInt(props.params.slug, 10),
    },
  })

  return (
    <>
      <AdminSourceHeader source={data.source} />
      <AdminSourcesFilters source={data.source} />
    </>
  )
}
