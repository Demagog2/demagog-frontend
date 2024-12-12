import { FragmentType, gql, useFragment } from '@/__generated__'
import formatDate from '@/libs/format-date'
import classNames from 'classnames'

const FacebookFactcheckMetadataFragment = gql(`
  fragment FacebookFactcheckMetadata on Article {
    articleType
    publishedAt
  }
`)

export function FacebookFactcheckMetadata(props: {
  article: FragmentType<typeof FacebookFactcheckMetadataFragment>
}) {
  const article = useFragment(FacebookFactcheckMetadataFragment, props.article)

  return (
    <>
      {article.articleType === 'facebook_factcheck' && (
        <p className={classNames('fs-16px fs-md-18px mt-8 mt-md-10')}>
          <span className={classNames('text-primary fw-bold')}>
            Meta fact-check
          </span>{' '}
          <i>
            <span className={classNames('col col-auto fs-16px fs-md-18px')}>
              {formatDate(article.publishedAt)}
            </span>
          </i>
        </p>
      )}
    </>
  )
}
