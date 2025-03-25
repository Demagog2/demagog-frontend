import { gql } from '@/__generated__'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { buildGraphQLVariables } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam kvízových otázek', 'Administrace'),
}

export default async function AdminEducation(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminEducation($first: Int, $last: Int, $after: String, $before: String, $term: String) {
        quizQuestions(first: $first, last: $last, after: $after, before: $before, filter: { search: $term }) {
          edges {
            node {
              id
              title
              description
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
      ...(term ? { term } : {}),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Kvízové otázky"
          description="Seznam kvízových otázek"
        />
        <div className="sm:flex">
          <AdminSearch label="Hledat kvízovou otázku" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/education/new'}>
              Přidat kvízovou otázku
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>
      <table className="admin-content-table">
        <thead>
          <tr>
            <th>Název</th>
          </tr>
        </thead>
        <tbody>
          {data.quizQuestions.edges?.map((edge) => {
            if (!edge?.node) {
              return null
            }

            const node = edge.node

            return (
              <tr key={node.id}>
                <td>{node.title}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </AdminPage>
  )
}
