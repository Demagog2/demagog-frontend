import { AdminWorkshopForm } from '@/components/admin/workshops/AdminWorkshopForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createWorkshop } from '../actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový workshop', 'Administrace'),
}

export default async function AdminWorkshopNew() {
  return <AdminWorkshopForm action={createWorkshop} title="Nový workshop" />
}
