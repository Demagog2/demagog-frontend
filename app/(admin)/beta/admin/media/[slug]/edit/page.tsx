import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { medium },
  } = await serverQuery({
    query: gql(`
      query AdminMediumEditMetadata($id: ID!) {
        medium(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(`Upravit pořad: ${medium.name}`),
  }
}

export default async function AdminMediaEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminMediaEdit($id: ID!) {
        medium(id: $id) {
          name
          }
        }
      `),
    variables: {
      id: props.params.slug,
    },
  })

  return <div>Upravit pořad {data.medium.name}</div>
}
