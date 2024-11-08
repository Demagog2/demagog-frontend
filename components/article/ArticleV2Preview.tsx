import { FragmentType, gql, useFragment } from '@/__generated__'
import ArticleItem from './Item'
import { SingleStatementArticlePreview } from './SingleStatementArticlePreview'

export const ArticleV2PreviewFragment = gql(`
    fragment ArticleV2PreviewFragment on ArticleV2 {
        __typename
        ... on SingleStatementArticle {
            ...SingleStatementArticlePreviewFragment
        }
        ... on Article {
            ...ArticleDetail
        }
    }
`)

export function ArticleV2Preview(props: {
  isEmbedded?: boolean
  article: FragmentType<typeof ArticleV2PreviewFragment>
}) {
  const article = useFragment(ArticleV2PreviewFragment, props.article)
  const { isEmbedded = false } = props

  if (!article) {
    return null
  }

  switch (article.__typename) {
    case 'SingleStatementArticle':
      return (
        <SingleStatementArticlePreview
          isEmbedded={isEmbedded}
          article={article}
        />
      )
    case 'Article':
      return <ArticleItem isEmbedded={isEmbedded} article={article} />
    default:
      return null
  }
}
