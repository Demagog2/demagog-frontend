import { gql } from '@/__generated__'
import { AdminStatementCommentInput } from '../AdminStatementCommentInput'
import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { AdminActivity } from './AdminActivity'
import { reverse, takeRight } from 'lodash'
import { pluralize } from '@/libs/pluralize'
import { ActivityTypeEnum } from '@/__generated__/graphql'
import { getActivityCount } from '@/app/(admin)/beta/admin/sources/[slug]/statements/[id]/actions'

const SHOW_ALL_THRESHOLD = 3

export function AdminStatementActivities(props: { statementId: string }) {
  const [showAll, setShowAll] = useState(false)
  const [commentsOnly, setCommentsOnly] = useState(false)
  const [newActivitiesCount, setNewActivitiesCount] = useState(0)
  const [showNewActivitiesButton, setShowNewActivitiesButton] = useState(false)

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

  const initialActivitiesCount = useMemo(() => {
    return data?.statementV2?.activitiesCount ?? 0
  }, [data?.statementV2?.activitiesCount])

  useEffect(() => {
    const interval = setInterval(async () => {
      const count = await getActivityCount(props.statementId, filter)

      console.table({
        count,
        initialActivitiesCount,
        result: count > initialActivitiesCount,
      })

      if (count > initialActivitiesCount) {
        setShowNewActivitiesButton(true)
      } else {
        setShowNewActivitiesButton(false)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [props.statementId, filter, initialActivitiesCount])

  // useEffect(() => {
  //   if (
  //     initialActivitiesCount !== null &&
  //     newActivitiesData?.statementV2?.activitiesCount
  //   ) {
  //     const newCount =
  //       newActivitiesData.statementV2.activitiesCount - initialActivitiesCount

  //     if (newCount > 0) {
  //       setNewActivitiesCount(newCount)
  //       setShowNewActivitiesButton(true)
  //       console.log(newCount)
  //       console.log(showNewActivitiesButton)
  //       console.log(initialActivitiesCount)
  //     } else {
  //       setNewActivitiesCount(0)
  //       setShowNewActivitiesButton(false)
  //     }
  //   }
  // }, [newActivitiesData?.statementV2?.activitiesCount, initialActivitiesCount])

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
    return <div>Nahrávám&hellip;</div>
  }

  const statement = data?.statementV2

  if (!statement) {
    return null
  }

  const activitiesData = reverse([...(statement.activities.edges || [])])

  const activities = showAll
    ? activitiesData
    : takeRight(activitiesData, SHOW_ALL_THRESHOLD)

  return (
    <div className="flow-root">
      <div className="flex flex-col gap-3">
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
        <ul role="list" className="mt-8 -mb-8">
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
                    <AdminActivity activity={activityItem.node} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {showNewActivitiesButton && <button>Zobrazit nové aktivity</button>}

      <AdminStatementCommentInput
        data={data}
        isPending={isPending}
        statementId={props.statementId}
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
