import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminArticleForm } from '@/components/admin/articles/AdminArticleForm'
import { createArticle } from '@/app/(admin)/beta/admin/articles/actions'
import { PropsWithSearchParams } from '@/libs/params'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový článek', 'Administrace'),
}

export default async function AdminArticleNew(props: PropsWithSearchParams) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleNew {
        ...AdminArticleForm
      }
  `),
  })

  return (
    <AdminArticleForm
      title="Nový článek"
      description="Vytvořte nový článek"
      data={data}
      action={createArticle}
    />
  )
}
