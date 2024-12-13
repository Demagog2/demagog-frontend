import { FragmentType, gql, useFragment } from '@/__generated__'
import ArticleSpeaker from './SpeakerDetail'
import formatDate from '@/libs/format-date'
import { Article } from './Article'
import classNames from 'classnames'

export const SingleStatementArticlePreviewFragment = gql(`
    fragment SingleStatementArticlePreviewFragment on SingleStatementArticle {
        id
        title
        pinned
        illustration(size: medium)
        statement {
            id
            content
            sourceSpeaker {
                ...ArticleSpeakerDetail
            }
            source {
              sourceUrl
              medium {
                name
              }
              releasedAt
            }
            assessment {
              veracity {
                key
                name
              }
            }
        }
    }
`)

export function SingleStatementArticlePreview(props: {
  article: FragmentType<typeof SingleStatementArticlePreviewFragment>
  isEmbedded?: boolean
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const { isEmbedded = false } = props

  const article = useFragment(
    SingleStatementArticlePreviewFragment,
    props.article
  )

  if (!article.statement) {
    return null
  }

  const articlePath = `/vyrok/${article.statement?.id}`

  return (
    <Article pinned={article.pinned}>
      <div
        className={classNames('row', {
          'd-flex justify-content-center justify-content-md-start mt-6 mx-0 bg-lightgrey radius-22px g-4 text-start g-md-6':
            isEmbedded,
          'g-2 g-lg-5': !isEmbedded,
        })}
      >
        <div
          className={classNames('col', {
            'mt-4 mt-md-7 ps-0 ms-md-7 mb-2 mb-md-3 col-4': isEmbedded,
            'col-md-5 col-12': !isEmbedded,
          })}
        >
          <div className="w-100">
            <a href={articlePath} className="illustration">
              <img
                src={mediaUrl + article.illustration}
                className="w-100"
                alt={`Ilustrační obrázek k ${article.title}`}
              />
            </a>
          </div>

          <div
            className={classNames(
              'd-flex justify-content-between align-items-center mt-2',
              { 'd-none d-md-flex': isEmbedded }
            )}
          >
            <div className="symbol-group">
              <ArticleSpeaker speaker={article.statement.sourceSpeaker} />
            </div>

            <div>
              {article.statement.assessment?.veracity?.key === 'true' && (
                <div className="d-flex align-items-center">
                  <span className="smaller fw-bold text-uppercase text-danger">
                    {article.statement.assessment?.veracity?.name}
                  </span>
                  <svg
                    className="ms-2"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 29.834C23.0091 29.834 29.5 23.343 29.5 15.334C29.5 7.32493 23.0091 0.833984 15 0.833984C6.99095 0.833984 0.5 7.32493 0.5 15.334C0.5 23.343 6.99095 29.834 15 29.834Z"
                      fill="#25AD23"
                    />
                    <path
                      d="M6.55713 15.5429L7.8888 14.1769L12.5116 18.7313L22.073 9.2041L23.4389 10.57L12.5116 21.4631L6.55713 15.5429Z"
                      fill="white"
                    />
                  </svg>
                </div>
              )}

              {article.statement.assessment?.veracity?.key === 'untrue' && (
                <div className="d-flex align-items-center">
                  <span className="smaller fw-bold text-uppercase text-danger">
                    {article.statement.assessment?.veracity?.name}
                  </span>
                  <svg
                    className="ms-2"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 29.834C23.0091 29.834 29.5 23.343 29.5 15.334C29.5 7.32493 23.0091 0.833984 15 0.833984C6.99095 0.833984 0.5 7.32493 0.5 15.334C0.5 23.343 6.99095 29.834 15 29.834Z"
                      fill="#E32219"
                    />
                    <path
                      d="M21.061 10.6579L19.6951 9.29199L15 13.9719L10.3049 9.29199L8.93896 10.6579L13.6303 15.334L8.93896 20.01L10.3049 21.376L15 16.6961L19.6951 21.376L21.061 20.01L16.3697 15.334L21.061 10.6579Z"
                      fill="white"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={classNames('col', {
            'mt-4 mt-md-7 col-7 col-md-6 mb-3 mb-md-6': isEmbedded,
            'col-12 col-md-7': !isEmbedded,
          })}
        >
          <h2
            className={classNames('fw-bold', {
              'fs-16px fs-md-26px mb-0 lh-110percent': isEmbedded,
              'fs-2  mb-2': !isEmbedded,
            })}
          >
            <a
              href={articlePath}
              className={classNames('text-dark s-title', {
                'text-decoration-none': isEmbedded,
              })}
            >
              {article.title}
            </a>
          </h2>
          <div
            className={classNames('mb-2', {
              'text-muted fs-12px fs-md-7': isEmbedded,
            })}
          >
            <i className={classNames({ 'text-muted': isEmbedded })}>
              {article.statement.source.medium?.name},{' '}
              {article.statement.source.releasedAt &&
                formatDate(article.statement.source.releasedAt)}
            </i>
            {isEmbedded && article.statement?.source?.sourceUrl && (
              <>
                <span className="col col-auto fs-12px fs-md-7 text-muted">
                  ,{' '}
                </span>
                <span className="col col-auto fs-12px fs-md-7 text-decoration-underline underline-offset-2px">
                  <i>
                    <a
                      href={article.statement.source.sourceUrl}
                      className="ext text-muted"
                    >
                      záznam
                    </a>
                  </i>
                </span>
              </>
            )}
          </div>

          <p
            className={classNames({
              'fs-12px fs-md-7 lh-md-base': isEmbedded,
              'fs-6 lh-sm': !isEmbedded,
            })}
          >
            „{article.statement.content.trim()}“
          </p>
          {isEmbedded ? null : (
            <div className="mt-4">
              <a href={articlePath} className="btn outline h-40px px-6 fw-bold">
                <span className="fs-7">Číst dál</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </Article>
  )
}
