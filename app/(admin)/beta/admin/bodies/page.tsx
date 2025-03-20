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
import { PencilIcon } from '@heroicons/react/24/outline'
import { buildGraphQLVariables } from '@/libs/pagination'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import formatDate from '@/libs/format-date'
import AdminBodyDelete from '@/components/admin/bodies/AdminBodyDeleteDialog'

export const metadata: Metadata = {
  title: getMetadataTitle('Strany a skupiny', 'Administrace'),
}

export default async function Bodies(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminBodies($first: Int, $last: Int, $after: String, $before: String, $term: String) {
        bodiesV2(first: $first, last: $last, after: $after, before: $before, filter: { name: $term}) {
          edges {
            node {
              foundedAt
              id
              isParty
              link
              logo
              name
              terminatedAt
              ...AdminBodyDelete
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
        <AdminPageTitle
          title="Strany a skupiny"
          description="Seznam stran a skupin"
        />
        <div className="sm:flex">
          <AdminSearch label="Hledat dle názvu" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/bodies/new'}>
              Přidat stranu / skupinu
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        {data.bodiesV2.edges?.map((edge) => {
          if (!edge?.node) {
            return null
          }

          return (
            <section key={edge.node.id} className="mt-6">
              <div className="space-y-8">
                <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                  <div className="px-4 py-6 sm:px-6 lg:gap-x-8 lg:p-8">
                    <div className="sm:flex">
                      <a href={`/beta/admin/bodies/${edge.node.id}`}>
                        <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                          {!edge.node.logo ? (
                            <span className="inline-block overflow-hidden rounded-lg bg-gray-100">
                              <svg
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="h-40 w-40 sm:h-full sm:w-full object-cover text-gray-300"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </span>
                          ) : (
                            <img
                              alt="logo"
                              src={edge.node.logo}
                              className="h-40 w-40 object-contain object-center sm:h-full sm:w-full"
                            />
                          )}
                        </div>
                      </a>

                      <div className="flex-grow mt-6 sm:ml-6 sm:mt-0 lg:ml-8">
                        <div className="flex justify-between">
                          <a href={`/beta/admin/bodies/${edge.node.id}`}>
                            <h3 className="text-base font-medium text-gray-900">
                              {edge.node.name}
                            </h3>
                          </a>

                          <div className="flex space-x-3">
                            <a
                              href={`/beta/admin/bodies/${edge.node.id}/edit`}
                              title="Upravit"
                            >
                              <PencilIcon className="h-6 w-6 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                            </a>
                            <AdminBodyDelete body={edge.node} />
                          </div>
                        </div>

                        {edge.node.isParty ? (
                          <p className="mt-3 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-800 ring-blue-700/10">
                            Politická strana
                          </p>
                        ) : (
                          <p className="mt-3 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-yellow-50 text-yellow-800 ring-yellow-600/20">
                            Skupina
                          </p>
                        )}
                        <div className="text-gray-600 text-sm">
                          <p className="mt-3">Respektovaný odkaz:</p>
                          {!edge.node.link ? (
                            <p>Nevyplněn</p>
                          ) : (
                            <a
                              href={edge.node.link}
                              className="hover:text-indigo-600"
                            >
                              {edge.node.link}
                            </a>
                          )}
                          <div className="flex gap-6 text-sm text-gray-600">
                            <div className="flex flex-col">
                              <p className="mt-3">Vznik:</p>

                              <p>
                                {!edge.node.foundedAt
                                  ? 'Nevyplněn'
                                  : formatDate(edge.node.foundedAt)}
                              </p>
                            </div>
                            {edge.node.terminatedAt && (
                              <div className="flex flex-col">
                                <p className="mt-3">Zánik:</p>

                                <p>
                                  {!edge.node.terminatedAt
                                    ? 'Nevyplněn'
                                    : formatDate(edge.node.terminatedAt)}
                                </p>
                              </div>
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

        <AdminPagination pageInfo={data.bodiesV2.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
