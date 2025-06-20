import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  highlightMentions,
  newlinesToParagraphsAndBreaks,
  nicerLinks,
} from '@/libs/comments/text'

const AdminCommentReplyPreviewFragment = gql(`
  fragment AdminCommentReplyPreview on Comment {
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

export function AdminCommentReplyPreview(props: {
  comment: FragmentType<typeof AdminCommentReplyPreviewFragment>
  onScrollToComment?: (commentId: string) => void
}) {
  const comment = useFragment(AdminCommentReplyPreviewFragment, props.comment)

  const truncatedReplyContent =
    (comment.reply?.content.length ?? 0) > 50
      ? comment.reply?.content.substring(0, 50) + '...'
      : comment.reply?.content

  return (
    <div
      className="mb-3 bg-gray-100 rounded-lg p-3 border-l-2 border-l-indigo-400 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
      title="Přejít na komentář"
      onClick={() => {
        if (comment.reply?.id) {
          props.onScrollToComment?.(comment.reply.id)
        }
      }}
    >
      <div className="text-gray-600 mb-1">{comment.reply?.user.fullName}</div>
      <div
        className="text-gray-500"
        dangerouslySetInnerHTML={{
          __html: newlinesToParagraphsAndBreaks(
            highlightMentions(nicerLinks(truncatedReplyContent ?? ''))
          ),
        }}
      />
    </div>
  )
}
