import { AdminBodyForm } from '@/components/admin/bodies/AdminBodyForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createBody } from '../actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nová strana / skupina', 'Administrace'),
}

export default async function AdminBodyNew() {
  return <AdminBodyForm title="Nová strana / skupina" action={createBody} />
}
