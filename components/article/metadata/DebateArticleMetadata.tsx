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
          <div className="mt-4 fs-5">
            {article.source.medium?.name}{' '}
            {article.source?.releasedAt && (
              <>ze dne {formatDate(article.source.releasedAt)}</>
            )}
            {((article.source.mediaPersonalities?.length ?? 0) > 0 ||
              article.source.sourceUrl) && (
              <>
                {' '}
                (
                {(article.source.mediaPersonalities?.length ?? 0) > 0 && (
                  <>
                    {(article.source.mediaPersonalities?.length ?? 0) > 1 ? (
                      <>moderátoři </>
                    ) : (
                      <>moderátor </>
                    )}
                    {article.source.mediaPersonalities
                      ?.map((mediaPersonality: any) => mediaPersonality.name)
                      .join(', ')}
                    {article.source.sourceUrl && ', '}
                  </>
                )}
                {article.source.sourceUrl && (
                  <a href={article.source.sourceUrl} className="ext">
                    záznam
                  </a>
                )}
                )
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
