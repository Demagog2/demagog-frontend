import { gql } from '@/__generated__'
import { AdminSourceHeader } from '@/components/admin/sources/AdminSourceHeader'
import { AdminSourcesFilters } from '@/components/admin/sources/AdminSourcesFilters'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
    title: getMetadataTitle(source.name, 'Administrace'),
  }
}

export default async function AdminSource(props: { params: { slug: string } }) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminSource($id: Int!) {
        source(id: $id) {
          ...AdminSourceHeader
          ...AdminSourcesFilters
        }
        
        ...AdminSourceHeaderData
        ...AdminSourceFiltersData
      }
    `),
    variables: {
      id: parseInt(props.params.slug, 10),
    },
  })

  return (
    <>
      <AdminSourceHeader data={data} source={data.source} />
      <AdminSourcesFilters source={data.source} statementsData={data} />
    </>
  )
}
