import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminUserAvatar } from '../../users/AdminUserAvatar'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { useRef } from 'react'
import {
  AdminActivityChangeDialog,
  ForwardedProps,
} from '../../layout/dialogs/AdminShortExplanationChangeDialog'

const AdminShortExplanationChangeActivityFragment = gql(`
    fragment AdminShortExplanationChangeActivity on ShortExplanationChangeActivity {
      createdAt
      oldExplanation
      newExplanation
      user {
        ...AdminUserAvatar
        id
        fullName
        avatar(size: small)
      }
    }
  `)

export function AdminShortExplanationChangeActivity(props: {
  activity: FragmentType<typeof AdminShortExplanationChangeActivityFragment>
}) {
  const activityItem = useFragment(
    AdminShortExplanationChangeActivityFragment,
    props.activity
  )

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <>
      <div className="relative">
        <AdminUserAvatar user={activityItem.user} size="extra-large" />

        <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
          <PencilSquareIcon
            aria-hidden="true"
            className="size-5 text-gray-400"
          />
        </span>
      </div>
      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => dialogRef.current?.openDialog()}
      >
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-900">
            {activityItem?.user?.fullName}
          </span>{' '}
          <span>změnil/a</span>{' '}
          <span className="font-medium text-gray-900">zkrácené odůvodnění</span>{' '}
          <time
            className="mt-0.5 text-sm text-gray-500"
            dateTime={activityItem.createdAt}
            title={displayDateTime(activityItem.createdAt ?? '')}
          >
            {displayDateTimeRelative(activityItem.createdAt ?? '')}
          </time>
        </div>
      </div>

      <AdminActivityChangeDialog
        ref={dialogRef}
        oldExplanation={activityItem.oldExplanation ?? ''}
        newExplanation={activityItem.newExplanation ?? ''}
      />
    </>
  )
}
