import { gql } from '@/__generated__'
import { AdminArticleForm } from '@/components/admin/articles/AdminArticleForm'
import { AdminArticleSingleStatementForm } from '@/components/admin/articles/AdminArticleSingleStatementForm'
import { serverQuery } from '@/libs/apollo-client-server'
import { updateArticle, updateArticleSingleStatement } from '../../actions'
import { ArticleTypeEnum } from '@/__generated__/graphql'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { PropsWithSearchParams } from '@/libs/params'
import { notFound } from 'next/navigation'
import { ApolloClientProvider } from '@/components/util/ApolloClientProvider'
import { getAuthorizationToken } from '@/libs/apollo-client'

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

export default async function AdminArticleEdit(
  props: PropsWithSearchParams<{
    params: { slug: string }
  }>
) {
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

  if (!data?.article) {
    notFound()
  }

  if (data.article?.articleType === ArticleTypeEnum.SingleStatement) {
    return (
      <AdminArticleSingleStatementForm
        title="Upravit článek s výrokem"
        article={data.article}
        action={updateArticleSingleStatement.bind(null, data.article.id)}
      />
    )
  }

  return (
    <ApolloClientProvider authorizationToken={getAuthorizationToken()}>
      <AdminArticleForm
        title="Upravit článek"
        data={data}
        article={data.article}
        action={updateArticle.bind(null, data.article.id)}
      />
    </ApolloClientProvider>
  )
}
