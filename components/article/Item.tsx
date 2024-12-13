import formatDate from '@/libs/format-date'
import Speaker from './SpeakerDetail'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { ArticleLink } from './ArticleLink'
import { Article } from './Article'
import classNames from 'classnames'
import { ArticleResponsivePerex } from './ArticleResponsivePerex'

export const ArticleDetailFragment = gql(`
  fragment ArticleDetail on Article {
    id
    slug
    illustration(size: medium)
    title
    pinned
    articleType
    source {
      sourceUrl
      medium {
        name
      }
      releasedAt
      sourceSpeakers {
        id
        ...ArticleSpeakerDetail
      }
    }
    publishedAt
    ...ArticleResponsivePerex
    ...ArticleLink
  }
`)

export default function ArticleItem(props: {
  article: FragmentType<typeof ArticleDetailFragment>
  isEmbedded?: boolean
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const article = useFragment(ArticleDetailFragment, props.article)

  const { isEmbedded = false } = props

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
            'mt-4 mt-md-7 ps-0 ms-md-7 mb-2 mb-md-5 col-4': isEmbedded,
            'col-md-5 col-12': !isEmbedded,
          })}
        >
          <div className="w-100">
            <ArticleLink className="illustration" article={article}>
              <img
                src={mediaUrl + article.illustration}
                className="w-100 rounded-m"
                alt={`Ilustrační obrázek k ${article.title}`}
              />
            </ArticleLink>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="symbol-group">
              {article.source?.sourceSpeakers?.map((speaker) => (
                <Speaker key={speaker.id} speaker={speaker} />
              ))}
            </div>
            <div>
              {article.articleType === 'default' && (
                <span className="smaller fw-bold text-uppercase">Ověřeno</span>
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
              'fs-16px fs-md-2 mb-0 lh-110percent': isEmbedded,
              'fs-2 mb-2': !isEmbedded,
            })}
          >
            <ArticleLink
              article={article}
              className={classNames('text-dark s-title', {
                'text-decoration-none': isEmbedded,
              })}
            >
              {article.title}
            </ArticleLink>
          </h2>
          <div
            className={classNames('mb-2', {
              'text-muted fs-12px fs-md-7': isEmbedded,
            })}
          >
            {article.articleType === 'default' && article.source && (
              <i className={classNames({ 'text-muted': isEmbedded })}>
                {article.source.medium?.name},{' '}
                {article.source?.releasedAt &&
                  formatDate(article.source.releasedAt)}
              </i>
            )}
            {(article.articleType === 'static' ||
              article.articleType === 'facebook_factcheck') && (
              <i className={classNames({ 'text-muted': isEmbedded })}>
                {formatDate(article.publishedAt)}
              </i>
            )}
            {article.articleType === 'single_statement' && article.source && (
              <i className={classNames({ 'text-muted': isEmbedded })}>
                {article.source.medium?.name},{' '}
                {article.source?.releasedAt &&
                  formatDate(article.source.releasedAt)}
              </i>
            )}
            {isEmbedded && article.source?.sourceUrl && (
              <>
                <span className="col col-auto fs-12px fs-md-7 text-muted">
                  ,{' '}
                </span>
                <span className="col col-auto fs-12px fs-md-7 text-decoration-underline underline-offset-2px">
                  <i>
                    <a
                      href={article.source.sourceUrl}
                      className="ext text-muted"
                    >
                      záznam
                    </a>
                  </i>
                </span>
              </>
            )}
          </div>
          <ArticleResponsivePerex isEmbedded={isEmbedded} article={article} />
          {isEmbedded ? null : (
            <div className="mt-4">
              <ArticleLink
                article={article}
                className="btn outline h-40px px-6 fw-bold fs-7"
              >
                <span className="fs-7">Číst dál</span>
              </ArticleLink>
            </div>
          )}
        </div>
      </div>
    </Article>
  )
}
