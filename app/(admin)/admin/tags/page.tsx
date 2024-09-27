import { gql } from '@/__generated__'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam štítků', 'Administrace'),
}

export default async function AdminTags() {
  const { data } = await serverQuery({
    query: gql(`
      query AdminTags {
        tagsV2 {
          edges {
            node {
              id
              name
              forStatementType
              publishedStatementsCount
              allStatementsCount
            }
          }
        }
      }
    `),
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Štítky"
          description="Seznam štítků pro výroky a sliby politiků."
        />
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
                  <td>{node.forStatementType}</td>
                  <td>{node.publishedStatementsCount}</td>
                  <td>{node.allStatementsCount}</td>
                  <td>
                    <Link
                      href={`/admin/tags/${node.id}/edit`}
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
      </AdminPageContent>
    </AdminPage>
  )
}
