import { FragmentType, gql, useFragment } from '@/__generated__'
import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

const AdminPublishedChangeActivityFragment = gql(` 
  fragment AdminPublishedChangeActivity on PublishedChangeActivity {
    updatedAt
    newPublished
    user {
      fullName
    }
  }
`)

export function AdminPublishedChangeActivity(props: {
  activity: FragmentType<typeof AdminPublishedChangeActivityFragment>
}) {
  const activityItem = useFragment(
    AdminPublishedChangeActivityFragment,
    props.activity
  )

  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
            <GlobeAltIcon aria-hidden="true" className="size-5 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <p className="text-sm text-gray-500">
          Uživatel{' '}
          <span className="font-medium text-gray-900">
            {activityItem?.user.fullName}
          </span>{' '}
          změnil/a stav na{' '}
          <span className="font-medium text-gray-900">
            {activityItem?.newPublished ? 'veřejný' : 'neveřejný'}
          </span>{' '}
          <time
            className="mt-0.5 text-sm text-gray-500"
            dateTime={activityItem.updatedAt}
            title={displayDateTime(activityItem.updatedAt ?? '')}
          >
            {displayDateTimeRelative(activityItem.updatedAt ?? '')}
          </time>
        </p>
      </div>
    </>
  )
}
