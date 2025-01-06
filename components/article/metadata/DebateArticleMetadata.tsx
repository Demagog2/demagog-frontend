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
          <h2 className='"fs-2 text-uppercase text-primary'>Ověřili jsme</h2>
          <div className="row g-1 mt-2">
            <span className="col col-auto fs-5">
              {article.source.medium?.name}
            </span>
            {article.source?.releasedAt && (
              <>
                <span className="col col-auto fs-5">ze dne</span>
                <span className="col col-auto fs-5">
                  {formatDate(article.source.releasedAt)}
                </span>
              </>
            )}

            {(article.source.mediaPersonalities?.length ?? 0) > 0 && (
              <span className="col col-auto fs-5">
                {(article.source.mediaPersonalities?.length ?? 0) > 1 ? (
                  <>(moderátoři</>
                ) : (
                  <>(moderátor</>
                )}
              </span>
            )}
            {article.source.mediaPersonalities?.map((mediaPersonality: any) => (
              <span key={mediaPersonality.id} className="col col-auto fs-5">
                {`${mediaPersonality.name},`}
              </span>
            ))}
            {article.source.sourceUrl && (
              <span className="col col-auto fs-5">
                <a href={article.source.sourceUrl} className="ext">
                  {article.source.mediaPersonalities?.length === 0 && '('}
                  záznam)
                </a>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  )
}
