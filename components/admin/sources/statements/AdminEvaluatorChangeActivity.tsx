import { FragmentType, gql, useFragment } from '@/__generated__'
import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { UsersIcon } from '@heroicons/react/20/solid'

const AdminEvaluatorChangeActivityFragment = gql(`
    fragment AdminEvaluatorChangeActivity on EvaluatorChangeActivity {
      createdAt
      newEvaluator {
          fullName
      }
      oldEvaluator {
          fullName
      }
      user {
        fullName
      }
    }
  `)

export function AdminEvaluatorChangeActivity(props: {
  activity: FragmentType<typeof AdminEvaluatorChangeActivityFragment>
}) {
  const activityItem = useFragment(
    AdminEvaluatorChangeActivityFragment,
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
            {activityItem?.user.fullName}
          </span>{' '}
          změnil/a ověřovatele{' '}
          <span className="font-medium text-gray-900">
            {activityItem?.oldEvaluator?.fullName}
          </span>{' '}
          na{' '}
          <span className="font-medium text-gray-900">
            {activityItem?.newEvaluator?.fullName}
          </span>{' '}
          <time
            className="mt-0.5 text-sm text-gray-500"
            dateTime={activityItem.createdAt}
            title={displayDateTime(activityItem.createdAt ?? '')}
          >
            {displayDateTimeRelative(activityItem.createdAt ?? '')}
          </time>
        </p>
      </div>
    </>
  )
}
