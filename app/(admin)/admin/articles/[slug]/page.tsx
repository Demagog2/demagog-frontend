import { gql } from '@/__generated__'

import { AdminArticleHeader } from '@/components/admin/articles/AdminArticleHeader'
import { AdminArticleContent } from '@/components/admin/articles/AdminArticleContent'
import { serverQuery } from '@/libs/apollo-client-server'

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
