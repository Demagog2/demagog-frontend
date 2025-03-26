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
        <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
          <LinkButton href="/beta/admin/article-tags">Zpět</LinkButton>
          <LinkButton
            href={`/beta/admin/article-tags/${props.params.slug}/edit`}
          >
            Upravit
          </LinkButton>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {articleTag.title}
            </h3>

            <div className="space-y-4 text-gray-600">
              <p
                className={classNames(
                  'w-fit rounded-md px-2 py-1 -ml-1 text-xs font-medium ring-1 ring-inset',
                  {
                    'bg-green-50 text-green-700 ring-green-600/20':
                      articleTag.published,
                    'bg-red-50 text-red-700 ring-red-600/20':
                      !articleTag.published,
                  }
                )}
              >
                {articleTag.published ? 'Veřejný' : 'Neveřejný'}
              </p>
              <div className="text-sm space-y-4">
                <div>
                  <p className="font-semibold">Popis:</p>
                  <p>{articleTag.description}</p>
                </div>

                <div>
                  <p className="font-semibold">Pozice:</p>
                  <p>{articleTag.order}</p>
                </div>
                <div>
                  <p className="font-semibold">Ikona</p>
                  <p>{articleTag.icon}</p>
                </div>

                <div>
                  <p className="font-semibold">Url:</p>
                  <p>{`/tag/${articleTag.slug}`}</p>
                </div>

                <div>
                  <p className="font-semibold">Statistika</p>
                  <p>{articleTag.stats}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
