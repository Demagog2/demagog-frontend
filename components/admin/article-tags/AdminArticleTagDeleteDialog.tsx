'use client'

import { useCallback } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { deleteArticleTag } from '@/app/(admin)/beta/admin/article-tags/actions'
import { AdminDeleteDialog } from '../layout/dialogs/AdminDeleteDialog'

const AdminArticleTagDeleteDialogFragment = gql(`
  fragment AdminArticleTagDeleteDialog on ArticleTag {
    id
    title
  }
`)

export default function AdminArticleTagDeleteDialog(props: {
  articleTag: FragmentType<typeof AdminArticleTagDeleteDialogFragment>
  className?: string
}) {
  const articleTag = useFragment(
    AdminArticleTagDeleteDialogFragment,
    props.articleTag
  )

  const handleDeleteArticleTag = useCallback(
    () => deleteArticleTag(articleTag.id),
    [articleTag]
  )

  return (
    <AdminDeleteDialog
      title="Smazat tag"
      description={
        <>
          Jste si opravdu jisti, že chcete smazat tag &quot;
          {articleTag.title}&quot;? Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteArticleTag}
    />
  )
}
