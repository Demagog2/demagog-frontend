import { gql } from '@/__generated__'
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="pb-5 sm:flex sm:items-center sm:justify-between">
        <AdminPageTitle
          title="Štítky"
          description="Seznam štítků pro výroky a sliby politiků."
        />
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Název
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Pro výroky typu
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Počet zveřejněných výroků
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Počet všech výroků
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Akce</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.tagsV2.edges?.map((edge) => {
                  if (!edge?.node) {
                    return null
                  }

                  const { node } = edge

                  return (
                    <tr key={node.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <Link href={`/admin/tags/${node.id}`}>{node.name}</Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {node.forStatementType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {node.publishedStatementsCount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {node.allStatementsCount}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
          </div>
        </div>
      </div>
    </div>
  )
}
