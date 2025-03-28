import { FragmentType, gql, useFragment } from '@/__generated__'
import { displayDate, isSameOrAfterToday } from '@/libs/date-time'
import { ClockIcon } from '@heroicons/react/20/solid'
import { PropsWithChildren } from 'react'

const ArticleStateFragment = gql(`
  fragment ArticleState on Article {
    published
    publishedAt
  }
`)

export function ArticleState(
  props: PropsWithChildren<{
    article: FragmentType<typeof ArticleStateFragment>
  }>
) {
  const article = useFragment(ArticleStateFragment, props.article)

  return (
    <>
      {props.children}

      {article.published &&
        article.publishedAt &&
        isSameOrAfterToday(article.publishedAt) && (
          <>Zveřejněný od {displayDate(article.publishedAt)}</>
        )}
      {article.published &&
        article.publishedAt &&
        !isSameOrAfterToday(article.publishedAt) && (
          <div className="flex items-center">
            <ClockIcon height={17} className="mr-1" /> Bude zveřejněný{' '}
            {displayDate(article.publishedAt)}
          </div>
        )}
      {!article.published && (
        <span className="text-gray-400">Nezveřejněný</span>
      )}
    </>
  )
}
