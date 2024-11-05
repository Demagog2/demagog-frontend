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
          sourcesCount
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
        <AdminPageTitle title={`Diskuze s pořadem ${data.medium.name}`} />
      </AdminPageHeader>
      <AdminPageContent>
        {data.medium.sourcesCount === 0 ? (
          <>
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <h2 className="display-5 fw-bold mb-2">
                Zde se bude zobrazovat seznam diskuzí
              </h2>
              <Link href={`/beta/admin/sources/new`}>
                <button
                  type="button"
                  className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                    className="mx-auto h-12 w-12 text-gray-400"
                  >
                    <path
                      d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-2 block text-sm font-semibold text-gray-900">
                    Přidat novou diskuzi
                  </span>
                </button>
              </Link>
            </div>
          </>
        ) : (
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
        )}

        <AdminPagination pageInfo={data.medium.sources.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
