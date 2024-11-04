import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { Metadata } from 'next'
import AdminMediumForm from '@/components/admin/media/AdminMediumForm'

export const metadata: Metadata = {
  title: 'Nový pořad',
}

export default function NewMedia() {
  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Přidat nový pořad" />
      </AdminPageHeader>
      <AdminMediumForm action="createMedium" />
    </AdminPage>
  )
}
