import { gql } from '@/__generated__'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import classNames from 'classnames'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { articleTag },
  } = await serverQuery({
    query: gql(`
      query AdminArticleTagDetailMetadata($id: ID!) {
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
      `Detail tagu: ${articleTag?.title}`,
      'Administrace'
    ),
  }
}

export default async function ArticleTagDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleTagDetail($id: ID!) {
        articleTag(id: $id) {
          id
          title
          slug
          published
          order
          description
          icon
          stats
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })
  const { articleTag } = data
  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title={articleTag.title ?? ''}
          description="Detail tagu"
        />
        <LinkButton href="/beta/admin/article-tags">Zpět</LinkButton>
      </AdminPageHeader>
      <AdminPageContent>
        <div className="border-b border-t border-gray-200 bg-white shadow-sm rounded-lg border">
          <div className="px-4 py-6 sm:px-6 lg:p-8">
            <div className="flex flex-col">
              <p
                className={classNames(
                  'w-fit rounded-md px-2 py-1 -ml-1 text-xs font-medium ring-1 ring-inset',
                  {
                    'bg-green-50 text-green-700 ring-green-600/20':
                      articleTag.published,
                    'bg-red-50 text-red-700 ring-red-600/10':
                      !articleTag.published,
                  }
                )}
              >
                {articleTag.published ? 'Veřejný' : 'Neveřejný'}
              </p>

              <div className="mt-4">
                <p className="font-medium text-gray-900">Popis:</p>
                <p className="mt-1 text-sm text-gray-500">
                  {articleTag.description}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col">
                  <div className="mt-3">
                    <p className="font-medium text-gray-900">Pozice:</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {articleTag.order}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="font-medium text-gray-900">Ikona</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {articleTag.icon}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="mt-3">
                    <p className="font-medium text-gray-900">Url:</p>
                    <p className="mt-1 text-sm text-gray-500">{`/tag/${articleTag.slug}`}</p>
                  </div>

                  <div className="mt-3">
                    <p className="font-medium text-gray-900">Statistika</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {articleTag.stats}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
