import { gql } from '@/__generated__'
import { PublishedArticleLink } from '@/components/admin/articles/PublishedArticleLink'
import { serverQuery } from '@/libs/apollo-client-server'
import Link from 'next/link'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import NewArticleDropdown from '@/components/admin/articles/NewArticleDropdown'
import { ArticleState } from '@/components/admin/articles/ArticleState'
import { ArticleTypeBadge } from '@/components/admin/articles/ArticleTypeBadge'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { toArticleTypeEnum } from '@/libs/enums'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import AdminArticleDeleteDialog from '@/components/admin/articles/AdminArticleDeleteDialog'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam článků', 'Administrace'),
}

export default async function AdminArticles(props: PropsWithSearchParams) {
  const { data } = await serverQuery({
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
              ...AdminArticleDeleteDialog
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
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Články" description="Seznam článků" />

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
      </AdminPageHeader>

      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Typ článku</th>
              <th scope="col">Stav</th>
              <th scope="col">Odkaz</th>
              <th scope="col">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.articlesV2.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              return (
                <tr key={edge.node.id}>
                  <td>
                    <Link href={`/admin/articles/${edge.node.id}`}>
                      {edge.node.title}
                    </Link>
                  </td>
                  <td>
                    <ArticleTypeBadge article={edge.node} />
                  </td>
                  <td>
                    <ArticleState article={edge.node} />
                  </td>
                  <td>
                    <PublishedArticleLink article={edge.node} />
                  </td>
                  <td>
                    <Link
                      href={`/admin/articles/${edge.node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </Link>

                    <AdminArticleDeleteDialog article={edge.node} />
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
