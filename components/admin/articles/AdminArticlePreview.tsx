import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminSingleStatementArticlePreview } from './AdminSingleStatementArticlePreview'

export const AdminArticleV2PreviewFragment = gql(`
  fragment AdminArticleV2PreviewFragment on ArticleV2 {
      __typename
      ... on SingleStatementArticle {
          ...SingleStatementArticlePreviewFragment
      }
      ... on Article {
          ...ArticleDetail
      }
  }
`)

export function AdminArticleV2Preview(props: {
  article: FragmentType<typeof AdminArticleV2PreviewFragment>
}) {
  const article = useFragment(AdminArticleV2PreviewFragment, props.article)

  if (!article) {
    return null
  }

  switch (article.__typename) {
    case 'SingleStatementArticle':
      return <AdminSingleStatementArticlePreview article={article} />
    case 'Article':
      return <AdminArticleItem article={article} />
    default:
      return null
  }
}
