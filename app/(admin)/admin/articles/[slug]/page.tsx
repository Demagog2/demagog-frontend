import { gql } from '@/__generated__'

import { AdminArticleHeader } from '@/components/admin/articles/AdminArticleHeader'
import { AdminArticleContent } from '@/components/admin/articles/AdminArticleContent'
import { serverQuery } from '@/libs/apollo-client-server'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { article },
  } = await serverQuery({
    query: gql(`
       query AdminArticleMetadata($id: ID!) {
          article(id: $id, includeUnpublished: true) {
            title
          }
        }
      `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(article.title, 'Administrace'),
  }
}

const ArticleQuery = gql(`
  query AdminArticle($id: ID!) {
    article(id: $id, includeUnpublished: true) {
      ...AdminArticleHeader
      ...AdminArticleContent
    }
  }
`)

export default async function AdminArticle(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: ArticleQuery,
    variables: {
      id: props.params.slug,
    },
  })

  return (
    <>
      <AdminArticleHeader article={data.article} />
      <AdminArticleContent article={data.article} />
    </>
  )
}
