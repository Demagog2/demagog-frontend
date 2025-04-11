import { FragmentType, gql, useFragment } from '@/__generated__'
import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { UsersIcon } from '@heroicons/react/20/solid'

const AdminSourceSpeakerChangeActivityFragment = gql(` 
    fragment AdminSourceSpeakerChangeActivity on SourceSpeakerChangeActivity {
      updatedAt
      newSourceSpeaker {
        fullName
      }
      oldSourceSpeaker {
        fullName
      }
      user {
        fullName
      }
    }
  `)

export function AdminSourceSpeakerChangeActivity(props: {
  activity: FragmentType<typeof AdminSourceSpeakerChangeActivityFragment>
}) {
  const activityItem = useFragment(
    AdminSourceSpeakerChangeActivityFragment,
    props.activity
  )

  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
            <UsersIcon aria-hidden="true" className="size-5 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <p className="text-sm text-gray-500">
          Uživatel{' '}
          <span className="font-medium text-gray-900">
            {activityItem.user.fullName}
          </span>{' '}
          změnil/a řečníka{' '}
          <span className="font-medium text-gray-900">
            {activityItem?.oldSourceSpeaker?.fullName}
          </span>{' '}
          na{' '}
          <span className="font-medium text-gray-900">
            {activityItem?.newSourceSpeaker?.fullName}
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
