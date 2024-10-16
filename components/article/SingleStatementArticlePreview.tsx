import { FragmentType, gql, useFragment } from '@/__generated__'
import Link from 'next/link'
import ArticleSpeaker from './SpeakerDetail'
import formatDate from '@/libs/format-date'
import { Article } from './Article'

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
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const article = useFragment(
    SingleStatementArticlePreviewFragment,
    props.article
  )

  if (!article.statement) {
    return null
  }

  const articlePath = `/vyroky/${article.statement?.id}`

  return (
    <Article pinned={article.pinned}>
      <div className="row g-2 g-lg-5">
        <div className="col col-12 col-md-5">
          <div className="w-100">
            <Link href={articlePath} className="illustration">
              <img
                src={mediaUrl + article.illustration}
                className="w-100"
                alt={`Ilustrační obrázek k ${article.title}`}
              />
            </Link>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-2">
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

        <div className="col col-12 col-md-7">
          <h2 className="fs-2 fw-bold mb-2">
            <Link href={articlePath} className="text-dark s-title">
              {article.title}
            </Link>
          </h2>
          <div className="mb-2">
            <i>
              {article.statement.source.medium?.name},{' '}
              {article.statement.source.releasedAt &&
                formatDate(article.statement.source.releasedAt)}
            </i>
          </div>

          <p className="fs-6 lh-sm">„{article.statement.content.trim()}“</p>

          <div className="mt-4">
            <Link
              href={articlePath}
              className="btn outline h-40px px-6 fw-bold"
            >
              <span className="fs-7">Číst dál</span>
            </Link>
          </div>
        </div>
      </div>
    </Article>
  )
}
