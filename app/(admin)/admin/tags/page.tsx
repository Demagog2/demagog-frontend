import { gql } from '@/__generated__'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { PropsWithSearchParams } from '@/libs/params'
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam štítků', 'Administrace'),
}

export default async function AdminTags(props: PropsWithSearchParams) {
  const before: string | null = null
  const after: string | null = null

  const { data } = await serverQuery({
    query: gql(`
      query AdminTags($after: String, $before: String) {
        tagsV2(first: 15, after: $after, before: $before) {
          edges {
            node {
              id
              name
              forStatementType
              publishedStatementsCount
              allStatementsCount
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
      ...(after ? { after } : {}),
      ...(before ? { before } : {}),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Štítky"
          description="Seznam štítků pro výroky a sliby politiků."
        />

        <div className="sm:flex">
          <div className="mt-3 sm:ml-4 sm:mt-0">
            <label htmlFor="mobile-search-candidate" className="sr-only">
              Hledat článek
            </label>
            <label htmlFor="desktop-search-candidate" className="sr-only">
              Hledat článek
            </label>
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="mobile-search-candidate"
                  name="mobile-search-candidate"
                  type="text"
                  placeholder="Hledat"
                  className="block w-full rounded-none rounded-l-md rounded-r-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:hidden"
                />
                <input
                  id="desktop-search-candidate"
                  name="desktop-search-candidate"
                  type="text"
                  placeholder="Hledat štítek"
                  className="hidden w-full rounded-none rounded-l-md rounded-r-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:block"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <Link
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              href="/admin/tags/new"
            >
              <PlusCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
              Přidat štítek
            </Link>
          </div>
        </div>
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

          {/* This value tells you whether we have previous page */}
          {data.tagsV2.pageInfo.hasPreviousPage}

          {/* This value tells you whether we have the next page */}
          {data.tagsV2.pageInfo.hasNextPage}

          {/* This value will be used for the query parameter "before" */}
          {data.tagsV2.pageInfo.startCursor}

          {/* This value will be used for the query parameter "after" */}
          {data.tagsV2.pageInfo.endCursor}
        </table>
      </AdminPageContent>
    </AdminPage>
  )
}
