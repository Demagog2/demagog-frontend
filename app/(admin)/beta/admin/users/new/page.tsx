import { gql } from '@/__generated__'
import { AdminUserForm } from '@/components/admin/users/AdminUserForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový uživatel', 'Administrace'),
}

const AdminUserNewQuery = gql(`
    query AdminNewUser {
      
  }
`)

export default function NewUser() {
  return <AdminUserForm title="Přidat nového člena týmu" />
}
