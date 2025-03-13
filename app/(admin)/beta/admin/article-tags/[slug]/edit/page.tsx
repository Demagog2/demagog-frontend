import { gql } from '@/__generated__'
import { AdminArticleTagForm } from '@/components/admin/article-tags/AdminArticleTagForm'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { updateArticleTag } from '../../actions'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { articleTag },
  } = await serverQuery({
    query: gql(`
      query AdminArticleTagEditMetadata($id: ID!) {
       articleTag(id: $id) {
        title
       }
      }
      `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(
      `Upravit tag: ${articleTag?.title}`,
      'Administrace'
    ),
  }
}

export default async function AdminArticleTagEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleTagEdit($id: ID!) {
        articleTag(id: $id) {
          id
          title
          ...AdminArticleTagData
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  return (
    <AdminArticleTagForm
      action={updateArticleTag.bind(null, data.articleTag.id)}
      title={`Upravit tag ${data.articleTag.title}`}
      articleTag={data.articleTag}
    />
  )
}
