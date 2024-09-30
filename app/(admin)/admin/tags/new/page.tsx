import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminTagForm } from '@/components/admin/tags/AdminTagForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createTag } from '../actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový štítek', 'Administrace'),
}

export default function AdminTagsNew() {
  return (
    <div>
      <AdminPageTitle title="Nový štítek" description="Vytvořte nový štítek" />
      <div className="mt-6">
        <AdminTagForm action={createTag} />
      </div>
    </div>
  )
}
