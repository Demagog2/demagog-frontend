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
            <div className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-indigo-600 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
              {data.notificationsV2.totalCount < 100
                ? data.notificationsV2.totalCount
                : '99+'}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}
