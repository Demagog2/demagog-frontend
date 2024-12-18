import { BellIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'

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
    >
      <span className="sr-only">View notifications</span>
      <div className="relative">
        <BellIcon aria-hidden="true" className="h-6 w-6" />
        {data.notificationsV2.totalCount > 0 && (
          <span className="absolute right-0 bottom-0 block size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </div>
    </a>
  )
}
