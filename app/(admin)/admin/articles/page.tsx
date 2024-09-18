import { gql } from '@/__generated__'
import { PublishedArticleLink } from '@/components/admin/articles/PublishedArticleLink'
import { adminQuery } from '@/libs/apollo-client'
import Link from 'next/link'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import NewArticleDropdown from '@/components/admin/articles/NewArticleDropdown'
import { ArticleState } from '@/components/admin/articles/ArticleState'
import { ArticleTypeBadge } from '@/components/admin/articles/ArticleTypeBadge'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { ArticleTypeEnum } from '@/__generated__/graphql'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam článků', 'Administrace'),
}
function toArticleTypeEnum(articleType: string): ArticleTypeEnum | undefined {
  switch (articleType) {
    case 'default':
      return ArticleTypeEnum.Default
    case 'facebook_factcheck':
      return ArticleTypeEnum.FacebookFactcheck
    case 'government_promises_evaluation':
      return ArticleTypeEnum.GovernmentPromisesEvaluation
    case 'single_statement':
      return ArticleTypeEnum.SingleStatement
    case 'static':
      return ArticleTypeEnum.Static
    default:
      return undefined
  }
}

export default async function AdminArticles(props: PropsWithSearchParams) {
  const { data } = await adminQuery({
    query: gql(`
      query AdminArticles($articleType: ArticleTypeEnum) {
        articlesV2(filter: { includeUnpublished: true, articleType: $articleType }) {
          edges {
            node {
              id
              title
              ...ArticleBadge
              ...ArticleState
              ...PublishedArticleLink
            }
          }
        }
      }
    `),
    variables: {
      articleType: toArticleTypeEnum(getStringParam(props.searchParams.type)),
    },
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="pb-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Články
          </h3>
          <p className="mt-2 text-sm text-gray-700">Seznam článků</p>
        </div>
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
                  placeholder="Hledat článek"
                  className="hidden w-full rounded-none rounded-l-md rounded-r-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:block"
                />
              </div>
              {/* <button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <BarsArrowUpIcon
                aria-hidden="true"
                className="-ml-0.5 h-5 w-5 text-gray-400"
              />
              Sort
              <ChevronDownIcon
                aria-hidden="true"
                className="-mr-1 h-5 w-5 text-gray-400"
              />
            </button> */}
            </div>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <NewArticleDropdown />
          </div>
        </div>
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
                    Typ článku
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Stav
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Odkaz
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.articlesV2.edges?.map((edge) => {
                  if (!edge?.node) {
                    return null
                  }

                  return (
                    <tr key={edge.node.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <Link href={`/admin/articles/${edge.node.id}`}>
                          {edge.node.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <ArticleTypeBadge article={edge.node} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <ArticleState article={edge.node} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <PublishedArticleLink article={edge.node} />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <Link
                          href={`/admin/articles/${edge.node.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Upravit
                        </Link>

                        <Link
                          href={`/admin/articles/${edge.node.id}/destroy`}
                          className="text-indigo-600 hover:text-indigo-900 ml-3"
                        >
                          Odstranit
                        </Link>
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
