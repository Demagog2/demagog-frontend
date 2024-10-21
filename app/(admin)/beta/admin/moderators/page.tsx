import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import Link from 'next/link'

import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { buildGraphQLVariables } from '@/libs/pagination'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import AdminMediaPersonalityDeleteDialog from '@/components/admin/media-personalities/AdminMediaPersonalityDeleteDialog'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam moderátorů', 'Administrace'),
}

export default async function AdminModerators(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminModerators($first: Int, $last: Int, $after: String, $before: String, $term: String) {
        mediaPersonalitiesV2(first: $first, last: $last, after: $after, before: $before, filter: { name: $term }) {
          edges {
            node {
              id
              name
              ...AdminMediaPersonalityDeleteDialog
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
      ...(term ? { term } : {}),
      ...buildGraphQLVariables({ before, after, pageSize: 10 }),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Moderátoří" description="Seznam moderátorů" />
        <div className="sm:flex">
          <AdminSearch label="Hledat moderátora" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/moderators/new'}>
              Přidat moderátora
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Jméno</th>
              <th scope="col">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.mediaPersonalitiesV2.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              return (
                <tr key={edge.node.id}>
                  <td>
                    <Link href={`/beta/admin/moderators/${edge.node.id}`}>
                      {edge.node.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/beta/admin/moderators/${edge.node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </Link>

                    <AdminMediaPersonalityDeleteDialog
                      mediaPersonality={edge.node}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <AdminPagination pageInfo={data.mediaPersonalitiesV2.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
