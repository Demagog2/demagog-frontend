import { FragmentType, gql, useFragment } from '@/__generated__'
import formatDate from '@/libs/format-date'
import classNames from 'classnames'

const StaticArticleMetadataFragment = gql(`
  fragment StaticArticleMetadata on Article {
    articleType
    publishedAt
  }
`)

export function StaticArticleMetadata(props: {
  article: FragmentType<typeof StaticArticleMetadataFragment>
}) {
  const article = useFragment(StaticArticleMetadataFragment, props.article)

  return (
    <>
      {article.articleType === 'static' && (
        <p className={classNames('fs-5 mt-8 mt-md-10')}>
          <span className={classNames('text-primary fw-bold')}>Komentář</span>{' '}
          <i>
            <span className="col col-auto fs-5">
              {formatDate(article.publishedAt)}
            </span>
          </i>
        </p>
      )}
    </>
  )
}
