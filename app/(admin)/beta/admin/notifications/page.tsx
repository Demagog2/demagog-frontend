import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { gql } from '@/__generated__'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminPageTabs } from '@/components/admin/layout/AdminPageTabs'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { serverQuery } from '@/libs/apollo-client-server'
import { getBooleanParam, getStringParam } from '@/libs/query-params'
import { buildGraphQLVariables } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'
import { Button } from '@headlessui/react'
import { BellSlashIcon } from '@heroicons/react/24/outline'
import formatDate from '@/libs/format-date'
import { markAsReadAndRedirect } from './actions'
import { MarkAsReadButton } from '@/components/notifications/MarkAsReadButton'

export const metadata: Metadata = {
  title: getMetadataTitle('Notifikační centrum', 'Administrace'),
}

export default async function AdminNotifications(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const showAll: boolean = getBooleanParam(props.searchParams.showAll)

  const { data } = await serverQuery({
    query: gql(`
      query AdminNotifications($first: Int, $last: Int, $after: String, $before: String, $includeRead: Boolean) {
        notificationsV2(first: $first, last: $last, after: $after, before: $before, filter: { includeRead: $includeRead }) {
          totalCount 
            edges {
            node {
              id
              fullText
              createdAt
              readAt
              statement {
                content
                id
              }
            }
          }
          pageInfo {
            ...AdminPagination
          }
        }
      }
    `),
    variables: {
      includeRead: showAll,
      ...buildGraphQLVariables({ before, after, pageSize: 10 }),
    },
  })

  const tabs = [
    { name: 'Nepřečtené', href: '?showAll=false', current: showAll === false },
    { name: 'Všechny', href: '?showAll=true', current: showAll === true },
  ]

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle title="Notifikační centrum" description="Upozornění" />
      </AdminPageHeader>
      <AdminPageContent>
        <AdminPageTabs tabs={tabs} />

        {data.notificationsV2.totalCount === 0 ? (
          <div className="text-center">
            <BellSlashIcon
              aria-hidden="true"
              className="mx-auto size-12 text-gray-400"
            />

            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Nemáte žádná nová oznámení
            </h3>
          </div>
        ) : (
          <table className="admin-content-table">
            <thead>
              <tr>
                <th className="w-1/2"></th>
                <th className="w-1/3"></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.notificationsV2.edges?.map((edge) => {
                if (!edge?.node) {
                  return null
                }

                return (
                  <tr
                    key={edge.node.id}
                    className="text-start hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <td className="w-1/2">
                      {edge.node.fullText}
                      <p className="mt-2 text-sm text-gray-500">
                        Vytvořeno dne {formatDate(edge.node.createdAt)}
                      </p>
                    </td>
                    <td className="w-1/2">{edge.node.statement.content}</td>

                    <td>
                      <MarkAsReadButton notificationId={edge.node.id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </AdminPageContent>
      <AdminPagination pageInfo={data.notificationsV2.pageInfo} />
    </AdminPage>
  )
}
