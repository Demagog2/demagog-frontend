import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { ArticlePlayer } from '@/components/article/player/ArticlePlayer'
import { ArticleIllustration } from '@/components/article/ArticleIllustration'
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
import Script from 'next/script'

export const revalidate = 180
export const dynamic = 'force-static'

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const { data } = await query({
    query: gql(`
      query articleGenerateStaticParams($first: Int) {
        homepageArticlesV3(first: $first) {
          nodes {
            ... on Article {
              slug
            }
            ... on SingleStatementArticle {
              slug
            }
          }
        }
      }
    `),
    variables: {
      first: 20,
    },
  })

  return (
    data.homepageArticlesV3?.nodes?.flatMap((node) =>
      node ? [{ slug: node.slug }] : []
    ) ?? []
  )
}

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
      query ArticleDetail($slug: ID!) {
        articleV3(id: $slug) {
          ... on Article {
            title
            articleType
            perex
            showPlayer
            ...DebateAticleMetadata
            ...FacebookFactcheckMetadata
            ...StaticArticleMetadata
            ...ArticleSegments
            ...ArticlePlayer
            ...ArticleIllustration
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
    <div className="container px-3 article-redesign text-align-start col-sm-8 mx-sm-auto">
      <div>
        <div>
          <div>
            <h1 className="display-1 fw-bold px-3 px-sm-0">{article.title}</h1>
            {article.showPlayer ? (
              <ArticlePlayer article={article} />
            ) : (
              <ArticleIllustration article={article} />
            )}
            <div className="mt-4 mt-md-9">
              <span className="perex">{article.perex}</span>
            </div>
          </div>
          <DebateArticleMetadata article={article} />
          <FacebookFactcheckMetadata article={article} />
          <StaticArticleMetadata article={article} />
        </div>
        <div>
          <ArticleSegments data={article} />
        </div>
      </div>
      <Iframely />
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
    </div>
  )
}
