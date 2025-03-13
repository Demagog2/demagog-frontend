import { Metadata } from 'next'
import AdminMediaPersonalitiesForm from '@/components/admin/media-personalities/AdminMediaPersonalitiesForm'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { createModerator } from '../actions'

export const metadata: Metadata = {
  title: 'Nový moderátor',
}

export default function NewModerator() {
  return (
    <AdminMediaPersonalitiesForm
      action={createModerator}
      title="Přidat nového moderátora"
    />
  )
}
