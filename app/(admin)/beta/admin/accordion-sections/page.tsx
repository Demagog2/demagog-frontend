import { gql } from '@/__generated__'
import AdminAccordionSectionDeleteDialog from '@/components/admin/accordion-section/AdminAccordionSectionDeleteDialog'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('Správa stránky o nás', 'Administrace'),
}

export default async function AdminAccordionSection() {
  const { data } = await serverQuery({
    query: gql(` 
    query AdminAccordionSection {
      accordionSections {
        edges {
          node {
            title
            published
            id
            ...AdminAccordionSectionDeleteDialog
          }
        }  
      }
    }
  `),
  })

  return (
    <>
      <AdminPage>
        <AdminPageHeader>
          <AdminPageTitle title="O nás" description="Správa stránky o nás" />
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
                        href={`beta/admin/accordion-sections/edit/${edge.node.id}`}
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
      </AdminPage>
    </>
  )
}
