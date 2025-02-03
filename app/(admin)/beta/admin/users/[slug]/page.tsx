import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { user },
  } = await serverQuery({
    query: gql(`
      query AdminUserEditMetadata($id: Int!) {
        user(id: $id) {
          fullName
        }
      }
    `),
    variables: {
      id: Number(props.params.slug),
    },
  })

  return {
    title: getMetadataTitle(
      `Detail uživatele: ${user.fullName}`,
      'Administrace'
    ),
  }
}

export default function UserDetail() {
  return <div>Detail člena</div>
}
