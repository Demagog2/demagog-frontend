import { getMetadataTitle } from '@/libs/metadata'
import { PropsWithSearchParams } from '@/libs/params'
import { Metadata } from 'next'
import { getStringParam } from '@/libs/query-params'
import { serverQuery } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { buildGraphQLVariables } from '@/libs/pagination'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import Link from 'next/link'
import { AdminPagination } from '@/components/admin/AdminPagination'
import AdminMediumDeleteDialog from '@/components/admin/media/AdminMediumDeleteDialog'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam pořadů', 'Administrace'),
}

export default async function AdminMedia(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
        query AdminMedia($first: Int, $last: Int, $after: String, $before: String, $term: String) {
          mediaV2(first: $first, last: $last, after: $after, before: $before, filter: { name: $term }) {
          edges {
            node {
              id
              name
              sourcesCount
             ...AdminMediumDeleteDialog
            }
          }
          pageInfo {
            ...AdminPagination
          }
        }
      }
    `),
    variables: {
      ...(term ? { term } : {}),
      ...buildGraphQLVariables({ before, after, pageSize: 10 }),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Pořady" description="Seznam pořadů" />
        <div className="sm:flex">
          <AdminSearch label="Hledat pořad" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/media/new'}>
              Přidat pořad
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Počet diskuzí</th>
              <th scope="col">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.mediaV2.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              return (
                <tr key={edge.node.id}>
                  <td>
                    <Link href={`/beta/admin/media/${edge.node.id}`}>
                      {edge.node.name}
                    </Link>
                  </td>
                  <td>{edge.node.sourcesCount}</td>
                  <td>
                    <Link
                      href={`/beta/admin/media/${edge.node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </Link>

                    <AdminMediumDeleteDialog medium={edge.node} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <AdminPagination pageInfo={data.mediaV2.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
