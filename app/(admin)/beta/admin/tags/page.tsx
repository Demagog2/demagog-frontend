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
import Link from 'next/link'
import { AdminTagType } from '@/components/admin/tags/AdminTagType'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam štítků', 'Administrace'),
}

export default async function AdminTags(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminTags($first: Int, $last: Int, $after: String, $before: String, $filter: TagsFilterInput) {
        tagsV2(first: $first, last: $last, after: $after, before: $before, filter: $filter) {
          edges {
            node {
              id
              name
              forStatementType
              publishedStatementsCount
              allStatementsCount
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
      ...buildGraphQLVariables({ before, after, pageSize: 15 }),
      filter: {
        term,
      },
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Štítky"
          description="Seznam štítků pro výroky a sliby politiků."
        />

        <div className="sm:flex">
          <AdminSearch label="Hledat štítek" defaultValue={term} />

          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href="/beta/admin/tags/new">
              Přidat štítek
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Pro výroky typu</th>
              <th scope="col">Počet zveřejněných výroků</th>
              <th scope="col">Počet všech výroků</th>
              <th scope="col">
                <span className="sr-only">Akce</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.tagsV2.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              const { node } = edge

              return (
                <tr key={node.id}>
                  <td>
                    <Link href={`/admin/tags/${node.id}`}>{node.name}</Link>
                  </td>
                  <td>
                    <AdminTagType statementType={node.forStatementType} />
                  </td>
                  <td>{node.publishedStatementsCount}</td>
                  <td>{node.allStatementsCount}</td>
                  <td>
                    <Link
                      href={`/beta/admin/tags/${node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </Link>

                    {/* <AdminArticleDeleteDialog article={edge.node} /> */}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <AdminPagination pageInfo={data.tagsV2.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
