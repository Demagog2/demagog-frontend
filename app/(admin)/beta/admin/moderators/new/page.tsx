import { Metadata } from 'next'
import AdminMediaPersonalitiesForm from '@/components/admin/media-personalities/AdminMediaPersonalitiesForm'
import { createModerator } from '../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export const metadata: Metadata = {
  title: 'Nový moderátor',
}

export default function NewModerator() {
  return (
    <AdminPage>
      <AdminMediaPersonalitiesForm
        action={createModerator}
        title="Přidat nového moderátora"
      />
    </AdminPage>
  )
}
