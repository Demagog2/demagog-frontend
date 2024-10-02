import { gql } from '@/__generated__'
import { AdminArticleForm } from '@/components/admin/articles/AdminArticleForm'
import { AdminArticleSingleStatementForm } from '@/components/admin/articles/AdminArticleSingleStatementForm'
import { serverQuery } from '@/libs/apollo-client-server'
import { updateArticle, updateArticleSingleStatement } from '../../actions'
import { ArticleTypeEnum } from '@/__generated__/graphql'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { article },
  } = await serverQuery({
    query: gql(`
       query AdminArticleEditMetadata($id: ID!) {
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
    title: getMetadataTitle(`Upravit ${article.title}`, 'Administrace'),
  }
}

export default async function AdminArticleEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleEdit($id: ID!) {
        article(id: $id, includeUnpublished: true) {
          id
          articleType
          ...AdminArticleFormFields
          ...AdminArticleSingleStatementFormFields
        }
        ...AdminArticleForm
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  if (data.article?.articleType === ArticleTypeEnum.SingleStatement) {
    return (
      <AdminArticleSingleStatementForm
        article={data.article}
        action={updateArticleSingleStatement.bind(null, data.article.id)}
      />
    )
  }

  return (
    <AdminArticleForm
      data={data}
      article={data.article}
      action={updateArticle.bind(null, data.article.id)}
    />
  )
}
