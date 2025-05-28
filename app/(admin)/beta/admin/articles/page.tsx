import { gql } from '@/__generated__'
import { PublishedArticleLink } from '@/components/admin/articles/PublishedArticleLink'
import { serverQuery } from '@/libs/apollo-client-server'

import NewArticleDropdown from '@/components/admin/articles/NewArticleDropdown'
import { ArticleState } from '@/components/admin/articles/ArticleState'
import { ArticleTypeBadge } from '@/components/admin/articles/ArticleTypeBadge'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { toArticleTypeEnum } from '@/libs/enums'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import AdminArticleDeleteDialog from '@/components/admin/articles/AdminArticleDeleteDialog'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { buildGraphQLVariables } from '@/libs/pagination'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam článků', 'Administrace'),
}

export default async function AdminArticles(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminArticles($articleType: ArticleTypeEnum, $first: Int, $last: Int, $after: String, $before: String, $term: String) {
        articlesV2(first: $first, last: $last, after: $after, before: $before, filter: { includeUnpublished: true, articleType: $articleType, title: $term }) {
          edges {
            node {
              id
              title
              articleType
              published
              integrations {
                efcsn {
                  createdAt
                }
                euroClimate {
                  createdAt 
                }
              }
              ...ArticleBadge
              ...ArticleState
              ...PublishedArticleLink
              ...AdminArticleDeleteDialog
            }
          }
          pageInfo {
            ...AdminPagination
          }
        }
      }
    `),
    variables: {
      articleType: toArticleTypeEnum(getStringParam(props.searchParams.type)),
      ...(term ? { term } : {}),
      ...buildGraphQLVariables({ before, after, pageSize: 15 }),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Články" description="Seznam článků" />
        <div className="sm:flex">
          <AdminSearch label="Hledat článek" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <NewArticleDropdown />
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Typ článku</th>
              <th scope="col">Stav</th>
              <th scope="col">Odkaz</th>
              <th scope="col">Integrace</th>
              <th scope="col">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.articlesV2.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              const integrationCount = [
                edge.node.integrations?.efcsn,
                edge.node.integrations?.euroClimate,
              ].filter(Boolean).length

              return (
                <tr key={edge.node.id}>
                  <td>
                    <a href={`/beta/admin/articles/${edge.node.id}`}>
                      {edge.node.title}
                    </a>
                  </td>
                  <td>
                    <ArticleTypeBadge article={edge.node} />
                  </td>
                  <td>
                    <ArticleState article={edge.node} />
                  </td>
                  <td>
                    <PublishedArticleLink article={edge.node} />
                  </td>
                  {edge.node.articleType === 'facebook_factcheck' &&
                  edge.node.published ? (
                    <td className="text-center">
                      <a
                        href={`/beta/admin/articles/${edge.node.id}/integrations`}
                        className="block text-indigo-600 hover:text-indigo-900 py-2 px-4"
                        title="Zobrazit integrace"
                      >
                        {integrationCount}
                      </a>
                    </td>
                  ) : (
                    <td></td>
                  )}

                  <td>
                    <a
                      href={`/beta/admin/articles/${edge.node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </a>

                    <AdminArticleDeleteDialog article={edge.node} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <AdminPagination pageInfo={data.articlesV2.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
