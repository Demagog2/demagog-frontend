import { AdminArticleTagForm } from '@/components/admin/article-tags/AdminArticleTagForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createArticleTag } from '../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový tag', 'Administrace'),
}

export default function AdminArticleTagsNew() {
  return (
    <AdminPage>
      <AdminArticleTagForm
        action={createArticleTag}
        title="Nový tag"
        description="Vytvořte nový tag"
      />
    </AdminPage>
  )
}
