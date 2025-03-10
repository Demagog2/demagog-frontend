import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminSingleStatementArticlePreview } from './AdminSingleStatementArticlePreview'
import AdminArticleItem from './AdminArticleItem'

export const AdminArticleV2PreviewFragment = gql(`
  fragment AdminArticleV2Preview on ArticleV2 {
      __typename
      ... on SingleStatementArticle {
        ...AdminSingleStatementArticlePreview
      }
      ... on Article {
        ...AdminArticleDetail
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
