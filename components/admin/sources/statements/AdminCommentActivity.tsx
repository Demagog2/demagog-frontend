import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/20/solid'
import { AdminUserAvatar } from '../../users/AdminUserAvatar'
import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import {
  highlightMentions,
  newlinesToParagraphsAndBreaks,
  nicerLinks,
} from '@/libs/comments/text'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

const AdminCommentActivityFragment = gql(`
  fragment AdminCommentActivity on CommentActivity {
    comment {
      id
      content
      createdAt
      user {
        ...AdminUserAvatar
        id
        fullName
        avatar(size: small)
      }
    }
  }
`)

export function AdminCommentActivity(props: {
  activity: FragmentType<typeof AdminCommentActivityFragment>
  commentRepliesEnabled?: boolean
  onReplyToComment?: (commentId: string | null) => void
  onFocusInput?: () => void
}) {
  const activityItem = useFragment(AdminCommentActivityFragment, props.activity)

  return (
    <>
      <div className="relative">
        <AdminUserAvatar user={activityItem.comment.user} size="extra-large" />

        <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
          <ChatBubbleLeftEllipsisIcon
            aria-hidden="true"
            className="size-5 text-gray-400"
          />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm">
              <a
                href={`/beta/admin/users/${activityItem?.comment.user?.id}`}
                className="font-medium text-gray-900"
              >
                {activityItem?.comment.user?.fullName}
              </a>
            </div>
            <time
              className="mt-0.5 text-sm text-gray-500"
              dateTime={activityItem.comment.createdAt}
              title={displayDateTime(activityItem.comment.createdAt ?? '')}
            >
              {displayDateTimeRelative(activityItem.comment.createdAt ?? '')}
            </time>
          </div>
          {props.commentRepliesEnabled && (
            <button
              className="text-gray-500 hover:text-indigo-600"
              type="button"
              title="Odpovědět na komentář"
              onClick={(e) => {
                e.preventDefault()
                props.onFocusInput?.()
                props.onReplyToComment?.(activityItem.comment.id)
              }}
            >
              <ArrowUturnLeftIcon
                width={20}
                height={20}
                className="text-gray-500 hover:text-indigo-600 cursor-pointer"
              />
            </button>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-700">
          <div
            className="admin-comment"
            dangerouslySetInnerHTML={{
              __html: newlinesToParagraphsAndBreaks(
                highlightMentions(
                  nicerLinks(activityItem?.comment.content ?? '')
                )
              ),
            }}
          />
        </div>
      </div>
    </>
  )
}
