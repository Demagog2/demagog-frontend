import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { Metadata } from 'next'
import AdminMediumForm from '@/components/admin/media/AdminMediumForm'
import { createMedium } from '../actions'

export const metadata: Metadata = {
  title: 'Nový pořad',
}

export default function NewMedia() {
  return (
    <AdminPage>
      <AdminMediumForm action={createMedium} title="Přidat nový pořad" />
    </AdminPage>
  )
}
