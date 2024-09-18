import { adminQuery } from '@/libs/apollo-client'
import { gql } from '@/__generated__'

import { AdminArticleHeader } from '@/components/admin/articles/AdminArticleHeader'

const ArticleQuery = gql(`
  query AdminArticle($id: ID!) {
    article(id: $id) {
      ...AdminArticleHeader
    }
  }
`)

export default async function AdminArticle(props: {
  params: { slug: string }
}) {
  const { data } = await adminQuery({
    query: ArticleQuery,
    variables: {
      id: props.params.slug,
    },
  })

  return (
    <>
      <AdminArticleHeader article={data.article} />
    </>
  )
}
