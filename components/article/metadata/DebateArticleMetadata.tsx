import { FragmentType, gql, useFragment } from '@/__generated__'
import formatDate from '@/libs/format-date'
import classNames from 'classnames'

const DebateArticleMetadataFragment = gql(`
  fragment DebateAticleMetadata on Article {
    articleType
    source {
      medium {
        name
      }
      releasedAt
      sourceUrl
      mediaPersonalities {
        id
        name
      }
    }
  }
`)

export function DebateArticleMetadata(props: {
  article: FragmentType<typeof DebateArticleMetadataFragment>
}) {
  const article = useFragment(DebateArticleMetadataFragment, props.article)

  return (
    <>
      {article.articleType === 'default' && article.source && (
        <div className={classNames('mb-5 mb-lg-10 mt-8 mt-md-10')}>
          <h2 className='"fs-2 text-uppercase text-primary'>OVĚŘENO</h2>
          <div className="mt-4 fs-5">
            <h2 className="fs-2 text-bold">
              <span className="text-decoration-underline">
                {article.source.sourceUrl ? (
                  <a href={article.source.sourceUrl}>
                    {article.source.medium?.name}
                  </a>
                ) : (
                  article.source.medium?.name
                )}
              </span>

              {article.source?.releasedAt && (
                <span className="text-decoration-none">
                  , {formatDate(article.source.releasedAt)}
                </span>
              )}
            </h2>
          </div>
        </div>
      )}
    </>
  )
}
