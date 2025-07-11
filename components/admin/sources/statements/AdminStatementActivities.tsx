import { gql } from '@/__generated__'
import { AdminStatementCommentInput } from '../AdminStatementCommentInput'
import { useMutation, useQuery } from '@apollo/client'
import {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { AdminActivity } from './AdminActivity'
import { reverse, takeRight } from 'lodash'
import { pluralize } from '@/libs/pluralize'
import { ActivityTypeEnum } from '@/__generated__/graphql'
import { getActivityCount } from '@/app/(admin)/beta/admin/sources/[slug]/statements/[id]/actions'
import { Spinner } from '../../forms/Spinner'
import { SecondaryButton } from '../../layout/buttons/SecondaryButton'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { AdminCommentReplyActivity } from './AdminCommentReplyActivity'
import { useRef } from 'react'

const SHOW_ALL_THRESHOLD = 3

export interface AdminStatementActivitiesRef {
  refetch: () => Promise<{ data?: unknown; errors?: unknown }>
}

export const AdminStatementActivities = forwardRef<
  AdminStatementActivitiesRef,
  {
    statementId: string
    commentRepliesEnabled?: boolean
  }
>(function AdminStatementActivities(props, ref) {
  const [showAll, setShowAll] = useState(false)
  const [commentsOnly, setCommentsOnly] = useState(false)
  const [newActivitiesCount, setNewActivitiesCount] = useState(0)
  const [showNewActivitiesButton, setShowNewActivitiesButton] = useState(false)
  const [isFetchingNew, setIsFetchingNew] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)
  const localStorageKey = `reply-preview-${props.statementId}`
  const [commentIdToReply, setCommentIdToReply] = useState<string | null>(
    localStorage.getItem(localStorageKey) ?? null
  )

  const handleReplyToComment = (commentId: string | null) => {
    if (commentId) {
      localStorage.setItem(localStorageKey, commentId)
      setCommentIdToReply(commentId)
    } else {
      localStorage.removeItem(localStorageKey)
      setCommentIdToReply(null)
    }
  }

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setTimeout(() => {
      inputRef.current?.querySelector('textarea')?.focus()
    }, 400)
  }

  const scrollToComment = (commentId: string) => {
    const highlight = (element: HTMLElement) => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
      element.classList.add('admin-comment-highlight')
      setTimeout(() => {
        element.classList.remove('admin-comment-highlight')
      }, 1000)
    }

    const tryScroll = () => {
      const element = document.getElementById(commentId)
      if (element) {
        highlight(element)
      } else if (!showAll) {
        setShowAll(true)
        setTimeout(tryScroll, 100)
      }
    }
    tryScroll()
  }

  const filter = useMemo(() => {
    return commentsOnly ? { activityType: ActivityTypeEnum.CommentCreated } : {}
  }, [commentsOnly])

  const { data, refetch, loading } = useQuery(
    gql(`
      query AdminStatementCommentsQuery($id: Int!, $filter: ActivityFilterInput) {
        ...AdminStatementCommentInput
        statementV2(id: $id, includeUnpublished: true) {
          activitiesCount(filter: $filter)
          activities(first: 100, filter: $filter) {
            edges {
              node {
                ...AdminActivity
                ... on CommentActivity {
                  ...AdminCommentReply
                  comment {
                    id
                  }
                  reply {
                    id
                    content
                    createdAt
                    user {
                      id
                      fullName
                    }
                  }
                }
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        id: parseInt(props.statementId, 10),
        filter,
      },
    }
  )

  // Expose refetch function to the parent component
  useImperativeHandle(
    ref,
    () => ({
      refetch,
    }),
    [refetch]
  )

  const initialActivitiesCount = useMemo(() => {
    return data?.statementV2?.activitiesCount ?? 0
  }, [data?.statementV2?.activitiesCount])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const count = await getActivityCount(props.statementId, filter)

        if (count > initialActivitiesCount) {
          setShowNewActivitiesButton(true)
          setNewActivitiesCount(count - initialActivitiesCount)
        } else {
          setShowNewActivitiesButton(false)
        }
      } catch (error) {
        Sentry.captureException(error)
        toast.error('Nepodařilo se načíst nové aktivity')
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [props.statementId, filter, initialActivitiesCount])

  const [createComment, { loading: isPending }] = useMutation(
    gql(`
      mutation CreateComment($commentInput: CommentInput!) {
          createComment(commentInput: $commentInput) {
            comment {
              id
              reply {
                id
                content
                user {
                  id
                  fullName
                }
              }
            }
          }
        }
    `)
  )

  const replyToComment = useMemo(() => {
    if (!commentIdToReply || !data?.statementV2?.activities?.edges) return null

    const nodes = data.statementV2.activities.edges.flatMap((edge) => {
      return edge?.node && edge?.node.__typename === 'CommentActivity'
        ? [edge.node]
        : []
    })

    return nodes.find((node) => node.comment.id === commentIdToReply)
  }, [commentIdToReply, data?.statementV2?.activities?.edges])

  if (loading) {
    return <div>Nahrávám&hellip;</div>
  }

  const statement = data?.statementV2

  if (!statement) {
    return null
  }

  const handleFetchNewActivities = async () => {
    setIsFetchingNew(true)
    try {
      await refetch()
      setShowNewActivitiesButton(false)
      setNewActivitiesCount(0)
    } finally {
      setIsFetchingNew(false)
    }
  }

  const activitiesData = reverse([...(statement.activities.edges || [])])

  const activities = showAll
    ? activitiesData
    : takeRight(activitiesData, SHOW_ALL_THRESHOLD)

  return (
    <div className="flow-root">
      <div className="flex flex-col gap-3 xl:mt-8">
        {statement.activitiesCount > SHOW_ALL_THRESHOLD && (
          <>
            {showAll ? (
              <a
                className="text-sm text-indigo-600 cursor-pointer"
                onClick={() => setShowAll(false)}
              >
                Zobrazit jen poslední {SHOW_ALL_THRESHOLD}{' '}
                {commentsOnly ? 'komentáře' : 'aktivity'}
              </a>
            ) : (
              <a
                className="text-sm text-indigo-600 cursor-pointer"
                onClick={() => setShowAll(true)}
              >
                Zobrazit {statement.activitiesCount - SHOW_ALL_THRESHOLD}{' '}
                {pluralize(
                  statement.activitiesCount - SHOW_ALL_THRESHOLD,
                  commentsOnly ? 'předchozí komentář' : 'předchozí aktivitu',
                  commentsOnly ? 'předchozí komentáře' : 'předchozí aktivity',
                  commentsOnly ? 'předchozích komentářů' : 'předchozích aktivit'
                )}
              </a>
            )}
          </>
        )}

        <button
          onClick={() => setCommentsOnly(!commentsOnly)}
          className="text-sm px-3 py-1 rounded-md hover:text-indigo-700 bg-gray-100 text-gray-700 max-w-fit"
        >
          {commentsOnly ? 'Všechny aktivity' : 'Pouze komentáře'}
        </button>
      </div>

      {activities?.length === 0 ? (
        <p className="text-gray-500 text-sm p-3 mt-3">Zatím žádné aktivity.</p>
      ) : (
        <ul
          role="list"
          className="mt-8 lg:mt-12 -mb-8 overflow-y-auto max-h-screen min-h-[400px]"
        >
          {activities?.map((activityItem, activityItemIdx: number) => {
            if (!activityItem?.node) {
              return null
            }

            return (
              <li key={activityItemIdx}>
                <div className="relative pb-8">
                  {activityItemIdx !== activities.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    />
                  )}

                  <div className="relative flex items-start space-x-3">
                    <AdminActivity
                      activity={activityItem.node}
                      commentRepliesEnabled={props.commentRepliesEnabled}
                      onReplyToComment={handleReplyToComment}
                      onFocusInput={scrollToInput}
                      onScrollToComment={scrollToComment}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {showNewActivitiesButton && (
        <SecondaryButton
          onClick={handleFetchNewActivities}
          type="button"
          disabled={isFetchingNew}
          className="mt-8"
        >
          {isFetchingNew ? (
            <>
              <Spinner className="text-dark" />
              Načítám...
            </>
          ) : (
            `Zobrazit ${newActivitiesCount}
          ${pluralize(
            newActivitiesCount,
            filter?.activityType === ActivityTypeEnum.CommentCreated
              ? 'nový komentář'
              : 'novou aktivitu',
            filter?.activityType === ActivityTypeEnum.CommentCreated
              ? 'nové komentáře'
              : 'nové aktivity',
            filter?.activityType === ActivityTypeEnum.CommentCreated
              ? 'nových komentářů'
              : 'nových aktivit'
          )}`
          )}
        </SecondaryButton>
      )}
      <div ref={inputRef}>
        {commentIdToReply && (
          <AdminCommentReplyActivity
            onCancelReply={handleReplyToComment}
            replyToComment={replyToComment}
          />
        )}

        <AdminStatementCommentInput
          data={data}
          isPending={isPending}
          statementId={props.statementId}
          isReply={!!commentIdToReply}
          onSubmit={(message) =>
            createComment({
              variables: {
                commentInput: {
                  statementId: props.statementId,
                  content: message,
                  ...(commentIdToReply && { replyId: commentIdToReply }),
                },
              },
              onCompleted() {
                setCommentIdToReply(null)
                refetch()
              },
            })
          }
        />
      </div>
    </div>
  )
})
