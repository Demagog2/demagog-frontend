import Link from 'next/link'
import truncate from '@/libs/truncate'
import formatDate from '@/libs/format-date'
import Speaker from './SpeakerDetail'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const ArticleDetailFragment = gql(`
  fragment ArticleDetail on Article {
    id
    perex
    slug
    illustration(size: medium)
    title
    speakers {
      id
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
`)

export default function ArticleItem(props: {
  article: FragmentType<typeof ArticleDetailFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const article = useFragment(ArticleDetailFragment, props.article)

  const perex = truncate(article.perex ?? '', 190)

  const articlePath = `/diskuze/${article.id}`

  return (
    <article className="col s-article">
      <div className="row g-2 g-lg-5">
        <div className="col col-12 col-md-5">
          <div className="d-flex">
            <Link href={articlePath} className="illustration d-flex">
              <img
                src={mediaUrl + article.illustration}
                className="w-100 rounded-m"
                alt={`Ilustrační obrázek k ${article.title}`}
              />
            </Link>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="symbol-group">
              {article.speakers?.map((speaker) => (
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
        <div className="col col-12 col-md-7">
          <h2 className="fs-2 fw-bold mb-2">
            <Link href={articlePath} className="text-dark s-title">
              {article.title}
            </Link>
          </h2>
          <div className="mb-2">
            {article.articleType === 'default' && article.source && (
              <i>
                {article.source.medium?.name},{' '}
                {article.source?.releasedAt &&
                  formatDate(article.source.releasedAt)}
              </i>
            )}

            {(article.articleType === 'static' ||
              article.articleType === 'facebook_factcheck') && (
              <i>{formatDate(article.publishedAt)}</i>
            )}

            {article.articleType === 'single_statement' && article.source && (
              <i>
                {article.source.medium?.name},{' '}
                {article.source?.releasedAt &&
                  formatDate(article.source.releasedAt)}
              </i>
            )}
          </div>
          <div>
            <span className="fs-6 lh-sm">{perex}</span>
          </div>
          <div className="mt-4">
            <Link
              href={articlePath}
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
