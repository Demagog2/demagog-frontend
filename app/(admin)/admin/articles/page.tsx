import { gql } from '@/__generated__'
import { PublishedArticleLink } from '@/components/admin/articles/PublishedArticleLink'
import { serverQuery } from '@/libs/apollo-client-server'
import Link from 'next/link'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
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

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam článků', 'Administrace'),
}

export default async function AdminArticles(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminArticles($articleType: ArticleTypeEnum, $after: String, $before: String, $term: String) {
        articlesV2(first: 15, after: $after, before: $before, filter: { includeUnpublished: true, articleType: $articleType, title: $term }) {
          edges {
            node {
              id
              title
              ...ArticleBadge
              ...ArticleState
              ...PublishedArticleLink
              ...AdminArticleDeleteDialog
            }
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            endCursor
            startCursor
          }
        }
      }
    `),
    variables: {
      articleType: toArticleTypeEnum(getStringParam(props.searchParams.type)),
      ...(after ? { after } : {}),
      ...(before ? { before } : {}),
      ...(term ? { term } : {}),
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

              return (
                <tr key={edge.node.id}>
                  <td>
                    <Link href={`/admin/articles/${edge.node.id}`}>
                      {edge.node.title}
                    </Link>
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
                  <td>
                    <Link
                      href={`/admin/articles/${edge.node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </Link>

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
