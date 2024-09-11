import { FragmentType, gql, useFragment } from '@/__generated__'
import formatDate from '@/libs/format-date'

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
        <p className="fs-5">
          <span className="text-primary">Meta fact-check</span>{' '}
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
