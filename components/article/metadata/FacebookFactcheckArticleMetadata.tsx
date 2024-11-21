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
        <p className={classNames('fs-5', { 'mt-29px mt-lg-39px': isRedesign })}>
          <span
            className={classNames('text-primary', { 'fw-bold': isRedesign })}
          >
            Meta fact-check
          </span>{' '}
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
