import { FragmentType, gql, useFragment } from '@/__generated__'

const ARTICLE_TYPE_LABEL: Record<string, string> = {
  default: 'Ověřeno',
  static: 'Komentář',
  single_statement: 'Jednotlivý výrok',
  facebook_factcheck: 'Facebook factcheck',
  government_promises_evaluation: 'Sliby',
}

const ArticleTypeBadgeFragment = gql(`
  fragment ArticleBadge on Article {
    articleType
  }
`)

export function ArticleTypeBadge(props: {
  article: FragmentType<typeof ArticleTypeBadgeFragment>
}) {
  const article = useFragment(ArticleTypeBadgeFragment, props.article)

  switch (article.articleType) {
    case 'default':
      return (
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          {ARTICLE_TYPE_LABEL[article.articleType]}
        </span>
      )
    case 'static':
      return (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          {ARTICLE_TYPE_LABEL[article.articleType]}
        </span>
      )

    case 'single_statement':
      return (
        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
          {ARTICLE_TYPE_LABEL[article.articleType]}
        </span>
      )

    case 'facebook_factcheck':
      return (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {ARTICLE_TYPE_LABEL[article.articleType]}
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {ARTICLE_TYPE_LABEL[article.articleType]}
        </span>
      )
  }
}
