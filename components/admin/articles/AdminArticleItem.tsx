import truncate from '@/libs/truncate'
import formatDate from '@/libs/format-date'
import Speaker from '@/components/article/SpeakerDetail'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { ArticleLink } from '@/components/article/ArticleLink'

export const AdminArticleDetailFragment = gql(`
    fragment AdminArticleDetail on Article {
      id
      perex
      slug
      illustration(size: medium)
      title
      pinned
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
      ...ArticleLink
    }
  `)

export default function AdminArticleItem(props: {
  article: FragmentType<typeof AdminArticleDetailFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const article = useFragment(AdminArticleDetailFragment, props.article)

  const perex = truncate(article.perex ?? '', 190)

  return (
    <article className="p-6 max-w-screen-lg mt-8 bg-[#E5E7EA] rounded-3xl">
      <div className="flex flex-col md:flex-row items-start justify-center gap-4 lg:gap-8">
        <div className="w-full h-full md:w-5/12">
          <ArticleLink className="illustration" article={article}>
            <img
              src={mediaUrl + article.illustration}
              className="w-full rounded-md"
              alt={`Ilustrační obrázek k ${article.title}`}
            />
          </ArticleLink>
        </div>

        <div className="w-full md:w-7/12 ">
          <h2 className="text-2xl font-bold mb-2 mt-0 articleItemH2">
            <ArticleLink article={article} className="text-gray-900 s-title">
              {article.title}
            </ArticleLink>
          </h2>
          <div className="mb-2 text-gray-700">
            {article.articleType === 'default' && article.source && (
              <i>
                {article.source.medium?.name},{' '}
                {article.source.releasedAt &&
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
                {article.source.releasedAt &&
                  formatDate(article.source.releasedAt)}
              </i>
            )}
          </div>
          <div>
            <span className="text-sm leading-tight">{perex}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
