import { AdminArticleSingleStatementForm } from '@/components/admin/articles/AdminArticleSingleStatementForm'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createSingleStatementArticle } from '@/app/(admin)/admin/articles/actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový článek z výroku', 'Administrace'),
}

export default function AdminArtilceNewSingleStatement() {
  return (
    <div>
      <AdminPageTitle
        title="Článek z výroku"
        description="Vytvořte nový článek z vybraného výroku."
      />
      <div className="mt-6">
        <AdminArticleSingleStatementForm
          action={createSingleStatementArticle}
        />
      </div>
    </div>
  )
}
