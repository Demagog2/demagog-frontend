import { AdminSourceForm } from '@/components/admin/sources/AdminSourceForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { serverQuery } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { createSource } from '../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export const metadata: Metadata = {
  title: getMetadataTitle('Nová diskuze', 'Administrace'),
}

const AdminSourceNewQuery = gql(`
    query AdminSourceNew {
      ...AdminSourceForm
    }
`)

export default async function AdminSourceNew() {
  const { data } = await serverQuery({
    query: AdminSourceNewQuery,
  })

  return (
    <AdminPage>
      <AdminSourceForm
        title={'Nová diskuze'}
        description={'Vytvořte diskuzi pro ověřování faktů.'}
        data={data}
        action={createSource}
      />
    </AdminPage>
  )
}
