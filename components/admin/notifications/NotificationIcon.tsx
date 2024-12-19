import { BellIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { pluralize } from '@/libs/pluralize'

const NotificationIconFragment = gql(`
  fragment NotificationIcon on Query {
    notificationsV2 {
      totalCount
    }
  }
`)

export function NotificationIcon(props: {
  data: FragmentType<typeof NotificationIconFragment>
}) {
  const data = useFragment(NotificationIconFragment, props.data)

  return (
    <a
      href="/beta/admin/notifications"
      className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
      title={`Máte ${data.notificationsV2.totalCount} ${pluralize(data.notificationsV2.totalCount, 'nepřečtené zprávy', 'nepřečtené zprávy', 'nepřečtených zpráv')}.`}
    >
      <span className="sr-only">View notifications</span>
      <div className="flex flex-row">
        <div className="relative">
          <BellIcon aria-hidden="true" className="h-6 w-6" />
          {data.notificationsV2.totalCount > 0 && (
            <span className="absolute right-0 bottom-0 block size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </div>

        {data.notificationsV2.totalCount > 0 && (
          <div className="ml-2">{data.notificationsV2.totalCount}</div>
        )}
      </div>
    </a>
  )
}
