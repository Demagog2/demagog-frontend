import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import { getMetadataTitle } from '@/libs/metadata'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { Link } from 'ckeditor5'
import { Metadata } from 'next'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@headlessui/react'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { buildGraphQLVariables } from '@/libs/pagination'

export const metadata: Metadata = {
  title: getMetadataTitle('Lidé', 'Administrace'),
}

export default async function Speakers(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(` 
      query AdminSpeakers($first: Int, $last: Int, $after: String, $before: String, $term: String){
        speakersV2(first: $first, last: $last, after: $after, before: $before, filter: { name: $term}){
          edges {
            node {
              avatar
              body {
                name
              }
              fullName
              id
              memberships {
                body {
                  name
                }
                id
                since
                until
              }
              osobaId
              websiteUrl
              wikidataId
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
        <AdminPageTitle title="Lidé" description="Seznam osob" />
        <div className="sm:flex">
          <AdminSearch label="Hledat dle jména" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/speakers/new'}>
              Přidat novou osobu
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        {data.speakersV2.edges?.map((edge) => {
          if (!edge?.node) {
            return null
          }

          return (
            <section key={edge.node.id} className="mt-6">
              <div className="space-y-8">
                <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                  <div className="px-4 py-6 sm:px-6 lg:gap-x-8 lg:p-8">
                    <div className="sm:flex">
                      <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                        {!edge.node.avatar ? (
                          <span className="inline-block overflow-hidden rounded-lg bg-gray-100">
                            <svg
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              className="h-full w-full object-cover text-gray-300"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                        ) : (
                          <img
                            alt={edge.node.fullName}
                            src={edge.node.avatar}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-grow mt-6 sm:ml-6 sm:mt-0 lg:ml-8">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-900">
                            {edge.node.fullName}
                          </h3>
                          <Button>
                            <TrashIcon className="h-6 w-6 text-gray-400  hover:text-indigo-600"></TrashIcon>
                          </Button>
                        </div>

                        <p className="mt-3 text-sm text-gray-500">
                          Wikidata ID: {edge.node.wikidataId}
                        </p>

                        <p className="mt-3 text-sm text-gray-500">
                          Hlídač státu OsobaID: {edge.node.osobaId}
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                          Respektovaný odkaz:
                        </p>
                        {!edge.node.websiteUrl ? (
                          <p className="text-sm text-gray-500">Nevyplněn</p>
                        ) : (
                          <a
                            href={edge.node.websiteUrl}
                            className="text-sm text-gray-500 hover:text-indigo-600"
                          >
                            {edge.node.websiteUrl}
                          </a>
                        )}

                        <p className="mt-3 text-sm text-gray-500">
                          Příslušnost ke skupinám/stranám:
                        </p>

                        {!edge.node.memberships?.length ? (
                          <p className="text-sm text-gray-500">Nevyplněno</p>
                        ) : (
                          edge.node.memberships?.map((membership) => {
                            return (
                              <p
                                key={membership.id}
                                className="text-sm text-gray900"
                              >
                                {membership.body.name} -{' '}
                                <span>
                                  od{' '}
                                  {!membership.since
                                    ? 'nevyplněno'
                                    : membership.since}
                                </span>
                                <span>
                                  {' '}
                                  do{' '}
                                  {!membership.until
                                    ? 'nevyplněno'
                                    : membership.until}
                                </span>
                              </p>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}

        <AdminPagination pageInfo={data.speakersV2.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
