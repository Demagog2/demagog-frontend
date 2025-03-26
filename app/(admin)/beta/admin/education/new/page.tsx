import { AdminQuizQuestionForm } from '@/components/admin/education/AdminQuizQuestionForm'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createQuizQuestion } from '../actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nová kvízová otázka', 'Administrace'),
}

export default async function AdminQuizQuestionNew() {
  return (
    <AdminPage>
      <AdminQuizQuestionForm
        action={createQuizQuestion}
        title="Nová kvízová otázka"
      />
    </AdminPage>
  )
}
