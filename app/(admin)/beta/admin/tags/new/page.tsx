import { AdminTagForm } from '@/components/admin/tags/AdminTagForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createTag } from '../actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový štítek', 'Administrace'),
}

export default function AdminTagsNew() {
  return (
    <AdminTagForm
      action={createTag}
      title="Nový štítek"
      description="Vytvořte nový štítek"
    />
  )
}
