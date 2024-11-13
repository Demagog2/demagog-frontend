import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { ArticlePlayer } from '@/components/article/player/ArticlePlayer'
import { ArticleSegments } from '@/components/article/ArticleSegments'
import { FacebookFactcheckMetadata } from '@/components/article/metadata/FacebookFactcheckArticleMetadata'
import { DebateArticleMetadata } from '@/components/article/metadata/DebateArticleMetadata'
import { StaticArticleMetadata } from '@/components/article/metadata/StaticArticleMetadata'
import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { getMetadataTitle } from '@/libs/metadata'
import { Iframely } from '@/components/site/Iframely'
import { DefaultMetadata } from '@/libs/constants/metadata'
import { truncate } from 'lodash'
import { imagePath } from '@/libs/images/path'
import { notFound } from 'next/navigation'
import { ArticleIllustrationsRedesign } from '@/components/article/ArticleIllustrationsRedesign'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { articleV2: article },
  } = await query({
    query: gql(`
       query ArticleMetadata($id: ID!) {
          articleV2(id: $id) {
            slug
            title
            perex
            illustration(size: medium)
          }
        }
      `),
    variables: {
      id: props.params.slug,
    },
  })

  if (!article) {
    notFound()
  }

  const title = getMetadataTitle(article.title)
  const description = truncate(article.perex ?? '', { length: 230 })
  const images = article.illustration
    ? { images: imagePath(article.illustration) }
    : {}
  const url = `${DefaultMetadata.openGraph?.url}/diskuze/${article.slug}`

  return {
    title,
    description,
    openGraph: {
      ...DefaultMetadata.openGraph,
      ...images,
      url,
      title,
      description,
    },
    twitter: {
      ...DefaultMetadata.twitter,
      ...images,
      title,
      description,
      card: 'summary_large_image',
    },
  }
}

export default async function Article(props: { params: { slug: string } }) {
  const { slug } = props.params

  const {
    data: { articleV3: article },
  } = await query({
    query: gql(`
      query ArticleDetailRedesign($slug: ID!) {
        articleV3(id: $slug) {
          ... on Article {
            title
            articleType
            perex
            ...DebateAticleMetadata
            ...FacebookFactcheckMetadata
            ...StaticArticleMetadata
            ...ArticleSegments
            ...ArticlePlayer
            ...ArticleIllustrationRedesign
          }
          ... on SingleStatementArticle {
            statement {
              id
            }
          }
        }
      }
    `),
    variables: {
      slug: slug,
    },
  })

  if (!article) {
    notFound()
  }

  if (article.__typename === 'SingleStatementArticle') {
    permanentRedirect(`/statements/${article.statement?.id}`)
  }

  if (article.__typename !== 'Article') {
    return null
  }

  return (
    <div className="container px-3 text-justify article-redesign col-sm-10 mx-sm-auto">
      <div className="row g-10">
        <div className="col-sm-10 mx-sm-auto">
          <div className="mb-5 mb-lg-10">
            <h1 className="display-4 fw-bold mb-5 text-start px-2">
              {article.title}
            </h1>

            <ArticleIllustrationsRedesign article={article} />

            <div>
              <span className="fs-5">{article.perex}</span>
            </div>
          </div>

          <DebateArticleMetadata article={article} />
          <FacebookFactcheckMetadata article={article} isRedesign />
          <StaticArticleMetadata article={article} isRedesign />
          <ArticlePlayer article={article} />
        </div>

        <div>
          <ArticleSegments data={article} isRedesign={true} />
        </div>
      </div>
      <Iframely />
    </div>
  )
}
