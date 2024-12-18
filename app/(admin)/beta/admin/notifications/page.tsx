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
import { getStringParam } from '@/libs/query-params'
import { buildGraphQLVariables } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'
import { BellSlashIcon } from '@heroicons/react/24/outline'
import { NotificationsTable } from '@/components/notifications/NotificationsTable'

export const metadata: Metadata = {
  title: getMetadataTitle('Nepřečtené', 'Notifikační centrum', 'Administrace'),
}

export default async function AdminNotifications(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)

  const { data } = await serverQuery({
    query: gql(`
      query AdminNotificationsUnread($first: Int, $last: Int, $after: String, $before: String, $includeRead: Boolean) {
        notificationsV2(first: $first, last: $last, after: $after, before: $before, filter: { includeRead: $includeRead }) {
          totalCount 
          ...NotificationsTable
          pageInfo {
            ...AdminPagination
          }
        }
      }
    `),
    variables: {
      includeRead: false,
      ...buildGraphQLVariables({ before, after, pageSize: 10 }),
    },
  })

  const tabs = [
    {
      name: 'Nepřečtené',
      href: '/beta/admin/notifications',
      current: true,
    },
    {
      name: 'Všechny',
      href: '/beta/admin/notifications/all',
      current: false,
    },
  ]

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Notifikační centrum"
          description="Nepřečtená upozornění"
        />
      </AdminPageHeader>
      <AdminPageContent>
        <AdminPageTabs tabs={tabs} />

        {data.notificationsV2.totalCount === 0 ? (
          <div className="text-center mt-10">
            <BellSlashIcon
              aria-hidden="true"
              className="mx-auto size-12 text-gray-400"
            />

            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Nemáte žádná nepřečtená oznámení.
            </h3>
          </div>
        ) : (
          <NotificationsTable notifications={data.notificationsV2} />
        )}
      </AdminPageContent>
      <AdminPagination pageInfo={data.notificationsV2.pageInfo} />
    </AdminPage>
  )
}
