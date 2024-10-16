import { AdminSourceForm } from '@/components/admin/sources/AdminSourceForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový zdroj', 'Administrace'),
}

export default async function AdminSourceNew() {
  return (
    <AdminSourceForm
      title={'Nová diskuze'}
      description={'Vytvářejte diskuzi pro ověřování faktů.'}
    />
  )
}
