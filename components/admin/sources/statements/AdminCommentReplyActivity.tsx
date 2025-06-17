import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  highlightMentions,
  newlinesToParagraphsAndBreaks,
  nicerLinks,
} from '@/libs/comments/text'
import { AdminUserAvatar } from '../../users/AdminUserAvatar'
import { XMarkIcon } from '@heroicons/react/24/outline'

const AdminCommentReplyFragment = gql(`
  fragment AdminCommentReply on CommentActivity {
    comment {
      id
      content
      user {
        ...AdminUserAvatar
        id
        fullName
        avatar(size: small)
      }
    }
    reply {
      id
      content
      user {
        id
        fullName
      }
    }
  }
`)

export function AdminCommentReplyActivity(props: {
  replyToComment?: FragmentType<typeof AdminCommentReplyFragment> | null
  onCancelReply: (commentId: string | null) => void
}) {
  const replyToComment = useFragment(
    AdminCommentReplyFragment,
    props.replyToComment
  )

  if (!replyToComment) {
    return null
  }

  const isLong = replyToComment.comment.content.length > 200

  return (
    <div
      className={`relative flex items-start space-x-3 bg-gray-100 p-2 rounded-lg mt-4 border-l-4 border-l-indigo-400 ${isLong ? 'pr-0' : 'pr-3'}`}
    >
      <div className="relative">
        <AdminUserAvatar user={replyToComment.comment.user} size="large" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <div>
            <div className="text-sm">
              <a
                href={`/beta/admin/users/${replyToComment.comment.user.id}`}
                className="font-medium text-gray-900"
              >
                {replyToComment.comment.user.fullName}
              </a>
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={() => props.onCancelReply(null)}
            title="Zrušit odpověď"
          >
            <XMarkIcon className={`h-5 w-5 ${isLong && 'mr-2'}`} />
          </button>
        </div>
        <div
          className={`mt-2 text-sm text-gray-700 ${isLong && 'max-h-40 overflow-y-auto pr-2'}`}
        >
          <div
            className="admin-comment"
            dangerouslySetInnerHTML={{
              __html: newlinesToParagraphsAndBreaks(
                highlightMentions(nicerLinks(replyToComment.comment.content))
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
}
