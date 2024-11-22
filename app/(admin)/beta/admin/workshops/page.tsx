import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { buildGraphQLVariables } from '@/libs/pagination'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import Link from 'next/link'
import { AdminPagination } from '@/components/admin/AdminPagination'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam workshopů', 'Administrace'),
}

export default async function AdminWorkshops(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminWorkshops($first: Int, $last: Int, $after: String, $before: String) {
        workshops(first: $first, last: $last, after: $after, before: $before) {
          edges {
            node {
              id
              name
            }
          }
          pageInfo {
            ...AdminPagination
          }
        }
      }
      `),
    variables: {
      ...buildGraphQLVariables({ before, after, pageSize: 10 }),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Workshopy" description="Seznam workshopů" />
        <div className="sm:flex">
          <AdminSearch label="Hledat workshop" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/workshops/new'}>
              Přidat workshop
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>
      <table className="admin-content-table">
        <thead>
          <tr>
            <th scope="col">Název</th>
            <th scope="col">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.workshops.edges?.map((edge) => {
            if (!edge?.node) {
              return null
            }

            return (
              <tr key={edge.node.id}>
                <td>
                  <Link href={`/beta/admin/workshops/${edge.node.id}`}>
                    {edge.node.name}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/beta/admin/workshops/${edge.node.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Upravit
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <AdminPagination pageInfo={data.workshops.pageInfo} />
    </AdminPage>
  )
}
