import { gql } from '@/__generated__'
import { AdminArticleForm } from '@/components/admin/articles/AdminArticleForm'
import { serverQuery } from '@/libs/apollo-client-server'
import { updateArticle } from '../../actions'

export default async function AdminArticleEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleEdit($id: ID!) {
        article(id: $id, includeUnpublished: true) {
          id
          ...AdminArticleFormFields
        }
        ...AdminArticleForm
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  return (
    <AdminArticleForm
      data={data}
      article={data.article}
      action={updateArticle.bind(null, data.article.id)}
    />
  )
}
