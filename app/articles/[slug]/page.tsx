import client from '@/libs/apollo-client'
import formatDate from '@/libs/format-date'
import { gql } from '@/__generated__'
import { ArticleSegments } from '@/components/article/ArticleSegments'
import { FacebookFactcheckMetadata } from '@/components/article/metainformation/FacebookFactcheckArticleMetadata'

const Diskuze = async (props: { params: { slug: string } }) => {
  const { slug } = props.params

  const {
    data: { article },
  } = await client.query({
    query: gql(`
      query ArticleDetail($slug: String!) {
        article(slug: $slug) {
          title
          perex
          articleType
          publishedAt
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
          ...FacebookFactcheckMetadata
          ...ArticleSegments
        }
      }
    `),
    variables: {
      slug: slug,
    },
  })

  return (
    <div className="container">
      <div className="row g-10">
        <div className="col col-12 col-lg-8">
          <div className="mb-5 mb-lg-10">
            <h1 className="display-4 fw-bold mb-5">{article.title}</h1>
            <div>
              <span className="fs-5">{article.perex}</span>
            </div>
          </div>
          {article.articleType === 'default' && article.source && (
            <div className="mb-5 mb-lg-10">
              <h2 className='"fs-2 text-uppercase text-primary'>
                Ověřili jsme
              </h2>
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
                      <>moderátoři</>
                    ) : (
                      <>moderátor</>
                    )}
                  </span>
                )}
                {article.source.mediaPersonalities?.map(
                  (mediaPersonality: any) => (
                    <span
                      key={mediaPersonality.id}
                      className="col col-auto fs-5"
                    >
                      {mediaPersonality.name}
                    </span>
                  )
                )}
                <span className="col col-auto fs-5">,</span>
                {article.source.sourceUrl && (
                  <span className="col col-auto fs-5">
                    <a href={article.source.sourceUrl} className="ext">
                      záznam
                    </a>
                  </span>
                )}
              </div>
            </div>
          )}

          <FacebookFactcheckMetadata article={article} />
        </div>
        <div className="col col-12">
          <ArticleSegments data={article} />
        </div>
      </div>
    </div>
  )
}

export default Diskuze
