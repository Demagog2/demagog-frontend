import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminArticleForm } from '@/components/admin/articles/AdminArticleForm'
import { createArticle } from '@/app/(admin)/admin/articles/actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový článek', 'Administrace'),
}

export default async function AdminArticleNew() {
  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleNew {
        ...AdminArticleForm
      }
  `),
  })

  return (
    <div>
      <AdminPageTitle title="Nový článek" description="Vytvořte nový článek" />
      <div className="mt-6">
        <AdminArticleForm data={data} action={createArticle} />
      </div>
    </div>
  )
}
