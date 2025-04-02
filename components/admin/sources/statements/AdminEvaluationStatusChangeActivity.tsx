import { FragmentType, gql, useFragment } from '@/__generated__'
import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { ASSESSMENT_STATUS_LABELS } from '@/libs/constants/assessment'

const AdminEvaluationStatusChangeActivityFragment = gql(`
  fragment AdminEvaluationStatusChangeActivity on EvaluationStatusChangeActivity {
      createdAt
      id
      oldStatus
      newStatus
      user {
        fullName
      }
    }
  `)

export function AdminEvaluationStatusChangeActivity(props: {
  activity: FragmentType<typeof AdminEvaluationStatusChangeActivityFragment>
}) {
  const activityItem = useFragment(
    AdminEvaluationStatusChangeActivityFragment,
    props.activity
  )

  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
            <ArrowPathIcon
              aria-hidden="true"
              className="size-5 text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-900">
            {activityItem?.user?.fullName}
          </span>{' '}
          změnil/a status{' '}
          <span className="font-medium text-gray-900">
            {' '}
            &quot;
            {
              ASSESSMENT_STATUS_LABELS[
                activityItem.oldStatus as keyof typeof ASSESSMENT_STATUS_LABELS
              ]
            }
            &quot;
          </span>{' '}
          na status{' '}
          <span className="font-medium text-gray-900">
            &quot;
            {
              ASSESSMENT_STATUS_LABELS[
                activityItem.newStatus as keyof typeof ASSESSMENT_STATUS_LABELS
              ]
            }
            &quot;
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
