import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminUserForm } from '@/components/admin/users/AdminUserForm'
import { updateUser } from '../../actions'

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
    query AdminUserEdit($id: Int!) {
      ...AdminUserFormFieldsData
      user(id: $id) {
        id
        fullName
        ...AdminUserData
      }
    }
  `)

export default async function AdminUserEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminUserEditQuery,
    variables: {
      id: Number(props.params.slug),
    },
  })

  return (
    <>
      <AdminUserForm
        title={`Upravit profil uživatele: ${data.user.fullName}`}
        action={updateUser.bind(null, data.user.id)}
        data={data}
        user={data.user}
      />
    </>
  )
}
