import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/20/solid'
import { gql } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import { displayDateTime } from '@/libs/date-time'
import {
  highlightMentions,
  newlinesToParagraphsAndBreaks,
} from '@/libs/comments/text'
import { AdminStatementCommentInput } from '../AdminStatementCommentInput'
import { useMutation, useQuery } from '@apollo/client'

export function AdminStatementComments(props: { statementId: string }) {
  const { data, refetch, loading } = useQuery(
    gql(`
      query AdminStatementCommentsQuery($id: Int!) {
        ...AdminStatementCommentInput
        statementV2(id: $id, includeUnpublished: true) {
          commentsCount
          comments {
            id
            content
            createdAt
            user {
              id
              fullName
              avatar(size: small)
            }
          }
        }
      }
    `),
    { variables: { id: parseInt(props.statementId, 10) } }
  )

  const [createComment, { loading: isPending }] = useMutation(
    gql(`
      mutation CreateComment($commentInput: CommentInput!) {
          createComment(commentInput: $commentInput) {
            comment {
              id
            }
          }
        }
    `)
  )

  if (loading) {
    return <div>Nahvrávám&hellip;</div>
  }

  const statement = data?.statementV2

  if (!statement) {
    return null
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {statement.comments.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id}>
            <div className="relative pb-8">
              {activityItemIdx !== statement.commentsCount - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                />
              )}

              <div className="relative flex items-start space-x-3">
                <>
                  <div className="relative">
                    {activityItem.user.avatar && (
                      <img
                        alt={activityItem.user.fullName}
                        src={imagePath(activityItem.user.avatar)}
                        className="flex size-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                      />
                    )}

                    <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
                      <ChatBubbleLeftEllipsisIcon
                        aria-hidden="true"
                        className="size-5 text-gray-400"
                      />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <a
                          href={`/beta/admin/users/${activityItem.user.id}`}
                          className="font-medium text-gray-900"
                        >
                          {activityItem.user.fullName}
                        </a>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Komentováno {displayDateTime(activityItem.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <div
                        className="admin-comment"
                        dangerouslySetInnerHTML={{
                          __html: newlinesToParagraphsAndBreaks(
                            highlightMentions(activityItem.content)
                          ),
                        }}
                      />
                    </div>
                  </div>
                </>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <AdminStatementCommentInput
        data={data}
        isPending={isPending}
        onSubmit={(message) =>
          createComment({
            variables: {
              commentInput: {
                statementId: props.statementId,
                content: message,
              },
            },
            onCompleted() {
              refetch()
            },
          })
        }
      />
    </div>
  )
}
