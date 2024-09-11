import client from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { ArticleSegments } from '@/components/article/ArticleSegments'
import { FacebookFactcheckMetadata } from '@/components/article/metadata/FacebookFactcheckArticleMetadata'
import { DebateArticleMetadata } from '@/components/article/metadata/DebateArticleMetadata'

const Article = async (props: { params: { slug: string } }) => {
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
          ...DebateAticleMetadata
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

          <DebateArticleMetadata article={article} />
          <FacebookFactcheckMetadata article={article} />
        </div>
        <div className="col col-12">
          <ArticleSegments data={article} />
        </div>
      </div>
    </div>
  )
}

export default Article
