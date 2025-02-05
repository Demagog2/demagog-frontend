import { gql } from '@/__generated__'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'

export const metadata: Metadata = {
  title: getMetadataTitle('Detail moderátora'),
}

export default async function ModeratorDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminModeratorDetail($id: ID!) {
        mediaPersonality(id: $id) {
          name
          sources {
            edges {
              node {
                name
                releasedAt
                medium {
                  name
                }
              }
            }
          }
        }
      }
    `),
    variables: { id: props.params.slug },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title={data.mediaPersonality.name} />
      </AdminPageHeader>
      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Publikováno</th>
              <th scope="col" className="text-right">
                Pořad
              </th>
            </tr>
          </thead>
          <tbody>
            {data.mediaPersonality.sources.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              return (
                <>
                  <tr key={edge.node.releasedAt}>
                    <td>{edge.node.name}</td>
                    <td>{edge.node.releasedAt}</td>
                    <td>{edge.node.medium?.name}</td>
                  </tr>
                  <tr></tr>
                </>
              )
            })}
          </tbody>
        </table>
      </AdminPageContent>
    </AdminPage>
  )
}
