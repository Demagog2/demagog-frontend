import { AdminArticleSingleStatementForm } from '@/components/admin/articles/AdminArticleSingleStatementForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createSingleStatementArticle } from '@/app/(admin)/beta/admin/articles/actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový článek z výroku', 'Administrace'),
}

export default function AdminArticleNewSingleStatement() {
  return (
    <AdminArticleSingleStatementForm
      title="Článek z výroku"
      description="Vytvořte nový článek z vybraného výroku."
      action={createSingleStatementArticle}
    />
  )
}
