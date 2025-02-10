import { gql } from '@/__generated__'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { LinkButton } from '@/components/admin/forms/LinkButton'

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
          id
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

  const sources = data?.mediaPersonality?.sources?.edges || []

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title={data.mediaPersonality.name}
          description="Detail moderátora"
        />
        <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
          <LinkButton
            href={`/beta/admin/moderators`}
            className="btn h-50px fs-6 s-back-link"
          >
            Zpět
          </LinkButton>
          <LinkButton
            href={`/beta/admin/moderators/${data.mediaPersonality.id}/edit`}
            className="btn h-50px fs-6 s-back-link"
          >
            Upravit
          </LinkButton>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        {sources.length === 0 ? (
          <>
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <p className="mt-2 text-sm text-gray-700 mb-2">
                Zde se bude zobrazovat seznam diskuzí s daným moderátorem
              </p>
              <a href={`/beta/admin/sources/new`}>
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
              </a>
            </div>
          </>
        ) : (
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
        )}
      </AdminPageContent>
    </AdminPage>
  )
}
