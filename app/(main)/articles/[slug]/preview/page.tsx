import { gql } from '@/__generated__'
import { ArticlePlayer } from '@/components/article/player/ArticlePlayer'
import { ArticleIllustration } from '@/components/article/ArticleIllustration'
import { ArticleSegments } from '@/components/article/ArticleSegments'
import { FacebookFactcheckMetadata } from '@/components/article/metadata/FacebookFactcheckArticleMetadata'
import { DebateArticleMetadata } from '@/components/article/metadata/DebateArticleMetadata'
import { StaticArticleMetadata } from '@/components/article/metadata/StaticArticleMetadata'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { Iframely } from '@/components/site/Iframely'
import { DefaultMetadata } from '@/libs/constants/metadata'
import { truncate } from 'lodash'
import { imagePath } from '@/libs/images/path'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { ArticleSocialShareButtons } from '@/components/article/ArticleSocialShareButtons'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminPreviewBanner } from '@/components/article/ArticlePreviewBanner'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { articleV2: article },
  } = await serverQuery({
    query: gql(`
      query ArticlePreviewMetadata($id: ID!) {
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
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(`/diskuze/${article.slug}`),
  }
}

export default async function ArticlePreview(props: {
  params: { slug: string }
}) {
  const { slug } = props.params

  const {
    data: { articleV3: article, currentUser },
  } = await serverQuery({
    query: gql(`
      query ArticlePreviewDetail($slug: ID!, $includeUnpublished: Boolean) {
        articleV3(id: $slug) {
          ... on Article {
            id
            title
            articleType
            perex
            showPlayer
            published
            ...ArticleSocialShareButtons
            ...DebateAticleMetadata
            ...FacebookFactcheckMetadata
            ...StaticArticleMetadata
            ...ArticleSegments
            ...ArticlePlayer
            ...ArticleIllustration
            ...AdminPreviewBanner
          }
          ... on SingleStatementArticle {
            statement {
              id
            }
          }
        }
        currentUser {
          id
        }
      }
    `),
    variables: {
      slug: slug,
      includeUnpublished: true,
    },
  })

  if (!currentUser?.id) {
    redirect(`/login?redirect=/diskuze/${slug}/preview`)
  }

  if (
    !article ||
    article.__typename === 'SingleStatementArticle' ||
    article.__typename !== 'Article'
  ) {
    notFound()
  }

  return (
    <>
      <div className="container px-3 article-container text-align-start col-sm-8 mx-sm-auto">
        <AdminPreviewBanner article={article} />
        <div>
          <div>
            <div>
              <h1 className="display-1 fw-bold px-3 px-sm-0">
                {article.title}
              </h1>
              <div className="d-flex justify-content-end">
                <ArticleSocialShareButtons article={article} />
              </div>

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
    </>
  )
}
