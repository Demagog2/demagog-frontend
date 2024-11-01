import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nový pořad',
}

export default function NewMedia() {
  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Přidat nový pořad" />
      </AdminPageHeader>

      {/* Use createMedium action to save new medium */}

      <form action="">
        <label htmlFor="new-media-field"> Základní údaje</label>
        <input id="new-media-field" type="text" />
        <button type="submit">Uložit</button>
      </form>
    </AdminPage>
  )
}
