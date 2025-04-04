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
import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { buildGraphQLVariables } from '@/libs/pagination'
import { imagePath } from '@/libs/images/path'
import AdminSpeakerDelete from '@/components/speaker/AdminSpeakerDeleteDialog'
import { PencilIcon } from '@heroicons/react/24/outline'
import formatDate from '@/libs/format-date'

export const metadata: Metadata = {
  title: getMetadataTitle('Lidé', 'Administrace'),
}

export default async function Speakers(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(` 
      query AdminSpeakers($first: Int, $last: Int, $after: String, $before: String, $term: String) {
        speakersV2(first: $first, last: $last, after: $after, before: $before, filter: { name: $term }) {
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
              ...AdminSpeakerDelete
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
                      <a href={`/beta/admin/speakers/${edge.node.id}`}>
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
                              src={imagePath(edge.node.avatar)}
                              className="h-full w-full rounded-lg object-cover"
                            />
                          )}
                        </div>
                      </a>

                      <div className="flex-grow mt-6 sm:ml-6 sm:mt-0 lg:ml-8">
                        <div className="flex justify-between">
                          <a href={`/beta/admin/speakers/${edge.node.id}`}>
                            <h3 className="text-base font-medium text-gray-900">
                              {edge.node.fullName}
                            </h3>
                          </a>

                          <div className="flex space-x-3">
                            <a
                              href={`/beta/admin/speakers/${edge.node.id}/edit`}
                              title="Upravit"
                            >
                              <PencilIcon className="h-6 w-6 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                            </a>
                            <AdminSpeakerDelete speaker={edge.node} />
                          </div>
                        </div>
                        <div className="text-gray-600">
                          <div className="flex flex-col mt-3 text-sm">
                            <p>Wikidata ID:</p>
                            <p>{edge.node.wikidataId ?? 'Nevyplněno'}</p>
                          </div>
                          <div className="flex flex-col mt-3 text-sm">
                            <p>Hlídač státu OsobaID:</p>
                            <p>{edge.node.osobaId ?? 'Nevyplněno'}</p>
                          </div>
                          <div className="flex flex-col mt-3 text-sm">
                            <p>Respektovaný odkaz:</p>
                            {!edge.node.websiteUrl ? (
                              <p>Nevyplněno</p>
                            ) : (
                              <a
                                href={edge.node.websiteUrl}
                                className="text-sm hover:text-indigo-600"
                              >
                                {edge.node.websiteUrl}
                              </a>
                            )}
                          </div>
                          <div className="flex flex-col mt-3 text-sm">
                            <p>Příslušnost ke stranám / skupinám:</p>
                            {!edge.node.memberships?.length ? (
                              <p>Nevyplněno</p>
                            ) : (
                              edge.node.memberships?.map((membership) => {
                                return (
                                  <p key={membership.id}>
                                    {membership.body.name} -{' '}
                                    <span>
                                      od{' '}
                                      {!membership.since
                                        ? 'nevyplněno'
                                        : formatDate(membership.since)}
                                    </span>
                                    <span>
                                      {' '}
                                      do{' '}
                                      {!membership.until
                                        ? 'nevyplněno'
                                        : formatDate(membership.until)}
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
