import { AdminWorkshopForm } from '@/components/admin/workshops/AdminWorkshopForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createWorkshop } from '../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový workshop', 'Administrace'),
}

export default async function AdminWorkshopNew() {
  return (
    <AdminPage>
      <AdminWorkshopForm action={createWorkshop} title="Nový workshop" />
    </AdminPage>
  )
}
