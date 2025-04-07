import { FragmentType, gql, useFragment } from '@/__generated__'
import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { ASSESSMENT_VERACITY_LABELS } from '@/libs/constants/assessment-veracity'

const AdminVeracityChangeActivityFragment = gql(`
    fragment AdminVeracityChangeActivity on VeracityChangeActivity {
      createdAt
      newVeracity
      oldVeracity
      user {
        fullName
      }
    }
  `)

export function AdminVeracityChangeActivity(props: {
  activity: FragmentType<typeof AdminVeracityChangeActivityFragment>
}) {
  const activityItem = useFragment(
    AdminVeracityChangeActivityFragment,
    props.activity
  )

  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
            <CheckBadgeIcon
              aria-hidden="true"
              className="size-5 text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <p className="text-sm text-gray-500">
          Uživatel{' '}
          <span className="font-medium text-gray-900">
            {activityItem?.user.fullName}
          </span>{' '}
          změnil/a hodnocení výroku z{' '}
          <span className="font-medium text-gray-900">
            &quot;
            {
              ASSESSMENT_VERACITY_LABELS[
                activityItem?.oldVeracity as keyof typeof ASSESSMENT_VERACITY_LABELS
              ]
            }
            &quot;
          </span>{' '}
          na{' '}
          <span className="font-medium text-gray-900">
            &quot;
            {
              ASSESSMENT_VERACITY_LABELS[
                activityItem?.newVeracity as keyof typeof ASSESSMENT_VERACITY_LABELS
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
