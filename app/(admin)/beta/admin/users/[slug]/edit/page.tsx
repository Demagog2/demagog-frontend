import { Metadata } from 'next'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'

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
    title: getMetadataTitle(`Upravit uživatele: ${user.fullName}`),
  }
}

const AdminUserEditQuery = gql(`
  fragment AdminUserEdit on User {
    firstName
    lastName
    email
    role {
      id
      key
      name
      permissions
      }
    emailNotifications
    userPublic
    avatar
    positionDescription
    bio
  }
`)

export default function EditUser() {
  return <div>Upravit člena</div>
}
