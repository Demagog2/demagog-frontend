import { FragmentType, gql, useFragment } from '@/__generated__'
import classNames from 'classnames'
import Link from 'next/link'
import { ARTICLE_TYPE_LABEL } from '@/libs/constants/article-type'

const ArticleTypeBadgeFragment = gql(`
  fragment ArticleBadge on Article {
    articleType
  }
`)

export function ArticleTypeBadge(props: {
  article: FragmentType<typeof ArticleTypeBadgeFragment>
}) {
  const article = useFragment(ArticleTypeBadgeFragment, props.article)

  const className = classNames(
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
    {
      'bg-yellow-50 text-yellow-800 ring-yellow-600/20':
        article.articleType === 'default',
      'bg-red-50 text-red-700 ring-red-600/10':
        article.articleType === 'static',
      'bg-green-50 text-green-700 ring-green-600/20':
        article.articleType === 'single_statement',
      'bg-blue-50 text-blue-700 ring-blue-700/10':
        article.articleType === 'facebook_factcheck',
      'bg-pink-50 text-pink-700 ring-pink-700/10':
        article.articleType === 'government_promises_evaluation',
    }
  )

  return (
    <Link href={`/beta/admin/articles?type=${article.articleType}`}>
      <span className={className}>
        {ARTICLE_TYPE_LABEL[article.articleType]}
      </span>
    </Link>
  )
}
