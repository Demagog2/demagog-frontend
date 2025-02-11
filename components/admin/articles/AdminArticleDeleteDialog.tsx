'use client'

import { useCallback } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteArticle } from '@/app/(admin)/beta/admin/articles/actions'
import { AdminDeleteDialog } from '../layout/dialogs/AdminDeleteDialog'

const AdminArticleDeleteDialogFragment = gql(`
  fragment AdminArticleDeleteDialog on Article {
    id
    title
  }
`)

export default function AdminArticleDeleteDialog(props: {
  article: FragmentType<typeof AdminArticleDeleteDialogFragment>
  className?: string
}) {
  const article = useFragment(AdminArticleDeleteDialogFragment, props.article)

  const handleDeleteArticle = useCallback(
    () => deleteArticle(article.id),
    [article]
  )

  return (
    <AdminDeleteDialog
      title="Smazat článek"
      className={props.className}
      description={
        <>
          Jste si opravdu jisti, že chcete smazat článek &quot;
          {article.title}&quot;? Všechny informace a obsah článku budou trvale
          odstraněny. Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteArticle}
    />
  )
}
