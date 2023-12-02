import Link from 'next/link'
import truncate from '@/libs/truncate'
import formatDate from '@/libs/format-date'
import Speaker, { ArticleSpeakerFragment } from './Spreaker'
import gql from 'graphql-tag'

export const ArticleDetailFragment = gql`
  fragment ArticleDetail on Article {
    id
    perex
    slug
    illustration
    title
    speakers {
      ...ArticleSpeakerDetail
    }
    articleType
    source {
      medium {
        name
      }
      releasedAt
    }
    publishedAt
  }
  ${ArticleSpeakerFragment}
`

export default function ArticleItem({ article, prefix }: any) {
  const perex = truncate(article.perex, 190)
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  return (
    <article className="col s-article" key={article.id}>
      <div className="row g-2 g-lg-5">
        <div className="col col-12 col-md-5">
          <div className="d-flex">
            <Link href={prefix + article.slug} className="illustration d-flex">
              <img src={mediaUrl + article.illustration} className="w-100" />
            </Link>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="symbol-group">
              {article.speakers.map((speaker: any) => (
                <Speaker
                  key={speaker.id}
                  speaker={speaker}
                  prefix="/politici/"
                />
              ))}
            </div>
            <div>
              {article.articleType === 'default' && (
                <span className="smaller fw-bold text-uppercase">Ověřeno</span>
              )}
            </div>
          </div>
        </div>
        <div className="col col-12 col-md-7">
          <h2 className="fs-2 fw-bold mb-2">
            <Link href={prefix + article.slug} className="text-dark s-title">
              {article.title}
            </Link>
          </h2>
          <div className="mb-2">
            {article.articleType === 'default' && article.source && (
              <i>
                {article.source.medium.name},{' '}
                {formatDate(article.source.releasedAt)}
              </i>
            )}

            {article.articleType === 'static' && (
              <i>{formatDate(article.publishedAt)}</i>
            )}

            {article.articleType === 'single_statement' && article.source && (
              <i>
                {article.source.medium.name},{' '}
                {formatDate(article.source.releasedAt)}
              </i>
            )}
          </div>
          <div>
            <span className="fs-6 lh-sm">{perex}</span>
          </div>
          <div className="mt-4">
            <Link
              href={prefix + article.slug}
              className="btn outline h-40px px-6 fw-bold fs-7"
            >
              Číst dál
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
