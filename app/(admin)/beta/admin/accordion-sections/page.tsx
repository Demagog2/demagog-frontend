import { gql } from '@/__generated__'
import AdminAccordionSectionDeleteDialog from '@/components/admin/accordion-sections/AdminAccordionSectionDeleteDialog'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
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
  title: getMetadataTitle('O nás', 'Administrace'),
}

export default async function AdminAccordionSection(
  props: PropsWithSearchParams
) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)

  const { data } = await serverQuery({
    query: gql(` 
    query AdminAccordionSection($first: Int, $last: Int, $after: String, $before: String) {
      accordionSections(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            title
            published
            id
            ...AdminAccordionSectionDeleteDialog
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
    <>
      <AdminPage>
        <AdminPageHeader>
          <AdminPageTitle title="O nás" description="Správa stránky o nás" />
          <div className="sm:flex">
            <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
              <CreateButton href={'/beta/admin/accordion-sections/new'}>
                Přidat sekci
              </CreateButton>
            </div>
          </div>
        </AdminPageHeader>
        <AdminPageContent>
          <table className="admin-content-table">
            <thead>
              <tr>
                <th scope="col">Název</th>
                <th scope="col">Zveřejnění</th>
                <th scope="col">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.accordionSections.edges?.map((edge) => {
                if (!edge?.node) {
                  return null
                }

                return (
                  <tr key={edge.node.id}>
                    <td>{edge.node.title}</td>
                    <td>
                      {edge.node.published ? 'Zveřejněno' : 'Nezveřejněno'}
                    </td>
                    <td>
                      <a
                        title="Upravit"
                        href={`/beta/admin/accordion-sections/${edge.node.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Upravit
                      </a>
                      <AdminAccordionSectionDeleteDialog
                        accordionSection={edge.node}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </AdminPageContent>
        <AdminPagination pageInfo={data.accordionSections.pageInfo} />
      </AdminPage>
    </>
  )
}
