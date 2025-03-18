import { AdminTagForm } from '@/components/admin/tags/AdminTagForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createTag } from '../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový štítek', 'Administrace'),
}

export default function AdminTagsNew() {
  return (
    <AdminPage>
      <AdminTagForm
        action={createTag}
        title="Nový štítek"
        description="Vytvořte nový štítek"
      />
    </AdminPage>
  )
}
