import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { buildGraphQLVariables } from '@/libs/pagination'
import { displayDate } from '@/libs/date-time'
import Link from 'next/link'

export const metadata: Metadata = {
  title: getMetadataTitle('Detail pořadu'),
}

export default async function MediaDetail(
  props: { params: { slug: string } } & PropsWithSearchParams
) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)

  const { data } = await serverQuery({
    query: gql(`
      query AdminMediumDetail($id: ID!, $first: Int, $last: Int, $after: String, $before: String) {
        medium(id: $id) {
          name
          sources(first: $first, last: $last, after: $after, before: $before) {
            edges {
              node {
                id
                name
                releasedAt
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
      }
    `),
    variables: {
      id: props.params.slug,
      ...buildGraphQLVariables({ before, after, pageSize: 10 }),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title={data.medium.name} />
      </AdminPageHeader>
      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th className="max-w-[200px]" scope="col">
                Název
              </th>
              <th scope="col" className="text-right max-w-[200px]">
                Zveřejněno
              </th>
            </tr>
          </thead>
          <tbody>
            {data.medium.sources.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              return (
                <tr key={edge.node.id}>
                  <td>
                    <Link href={`/beta/admin/sources/${edge.node.id}`}>
                      {edge.node.name}
                    </Link>
                  </td>
                  <td>
                    {edge.node.releasedAt
                      ? displayDate(edge.node.releasedAt)
                      : 'neuvedeno'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <AdminPagination pageInfo={data.medium.sources.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
