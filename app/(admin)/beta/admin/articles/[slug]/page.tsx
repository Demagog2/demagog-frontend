import { gql } from '@/__generated__'

import { AdminArticleHeader } from '@/components/admin/articles/AdminArticleHeader'
import { AdminArticleContent } from '@/components/admin/articles/AdminArticleContent'
import { serverQuery } from '@/libs/apollo-client-server'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { articleV2: article },
  } = await serverQuery({
    query: gql(`
       query AdminArticleMetadata($id: ID!) {
          articleV2(id: $id) {
            title
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

  return {
    title: getMetadataTitle(article.title, 'Administrace'),
  }
}

const ArticleQuery = gql(`
  query AdminArticle($id: ID!) {
    articleV2(id: $id) {
      ...AdminArticleHeader
      ...AdminArticleContent
    }
  }
`)

export default async function AdminArticle(props: {
  params: { slug: string }
}) {
  const {
    data: { articleV2: article },
  } = await serverQuery({
    query: ArticleQuery,
    variables: {
      id: props.params.slug,
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <>
      <AdminArticleHeader article={article} />
      <AdminArticleContent article={article} />
    </>
  )
}
