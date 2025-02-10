import { gql } from '@/__generated__'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { buildGraphQLVariables } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { Metadata } from 'next'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import AdminArticleTagDeleteDialog from '@/components/admin/article-tags/AdminArticleTagDeleteDialog'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam tagů', 'Administrace'),
}

export default async function AdminTags(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const title: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleTags($first: Int, $last: Int, $after: String, $before: String, $filter: ArticleTagsFilterInput) {
        articleTagsV2(first: $first, last: $last, after: $after, before: $before, filter: $filter) {
          edges {
            node {
              id
              title
              slug
              published
              order
              ...AdminArticleTagDeleteDialog
            }
          }
          pageInfo {
            ...AdminPagination
          }
        }
      }
    `),
    variables: {
      ...buildGraphQLVariables({ before, after, pageSize: 15 }),
      filter: {
        title,
      },
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Tagy" description="Seznam tagů článků." />

        <div className="sm:flex">
          <AdminSearch label="Hledat tag" defaultValue={title} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href="/beta/admin/article-tags/new">
              Přidat Tag
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">URL</th>
              <th scope="col">Stav</th>
              <th scope="col">Pozice</th>
              <th scope="col">
                <span className="sr-only">Akce</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.articleTagsV2?.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              const { node } = edge

              return (
                <tr key={node.id}>
                  <td>
                    <a href={`/beta/admin/article-tags/${node.id}`}>
                      {node.title}
                    </a>
                  </td>
                  <td>/tag/{node.slug}</td>
                  <td>{node.published ? 'Veřejný' : 'Neveřejný'}</td>
                  <td>{node.order}</td>
                  <td>
                    <a
                      href={`/beta/admin/article-tags/${node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </a>

                    <AdminArticleTagDeleteDialog articleTag={edge.node} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {data?.articleTagsV2 && (
          <AdminPagination pageInfo={data.articleTagsV2.pageInfo} />
        )}
      </AdminPageContent>
    </AdminPage>
  )
}
