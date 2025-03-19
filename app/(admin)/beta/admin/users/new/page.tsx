import { gql } from '@/__generated__'
import { AdminUserForm } from '@/components/admin/users/AdminUserForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createUser } from '../actions'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový uživatel', 'Administrace'),
}

const AdminUserNewQuery = gql(`
  query AdminNewUser {
    ...AdminUserFormFieldsData
  }
`)

export default async function NewUser() {
  const { data } = await serverQuery({
    query: AdminUserNewQuery,
  })

  return (
    <AdminPage>
      <AdminUserForm
        title="Přidat nového člena týmu"
        action={createUser}
        data={data}
      />
    </AdminPage>
  )
}
