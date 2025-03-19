import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminSpeakerForm } from '@/components/speaker/AdminSpeakerForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createSpeaker } from '../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

const AdminSpeakerNewQuery = gql(`
  query AdminSpeakerNew {
    ...AdminSpeakerForm
  }
`)

export const metadata: Metadata = {
  title: getMetadataTitle('Nová osoba', 'Administrace'),
}

export default async function AdminSpeakerNew() {
  const { data } = await serverQuery({
    query: AdminSpeakerNewQuery,
  })

  return (
    <AdminPage>
      <AdminSpeakerForm title="Nová osoba" data={data} action={createSpeaker} />
    </AdminPage>
  )
}
