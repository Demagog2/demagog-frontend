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
  isRedesign?: boolean
}) {
  const article = useFragment(FacebookFactcheckMetadataFragment, props.article)
  const { isRedesign = false } = props

  return (
    <>
      {article.articleType === 'facebook_factcheck' && (
        <p
          className={classNames({
            'fs-16px fs-md-18px mt-30px mt-md-40px': isRedesign,
            'fs-5': !isRedesign,
          })}
        >
          <span
            className={classNames('text-primary', { 'fw-bold': isRedesign })}
          >
            Meta fact-check
          </span>{' '}
          <i>
            <span
              className={classNames('col col-auto', {
                'fs16px fs-md-18px': isRedesign,
                'fs-5': !isRedesign,
              })}
            >
              {formatDate(article.publishedAt)}
            </span>
          </i>
        </p>
      )}
    </>
  )
}
