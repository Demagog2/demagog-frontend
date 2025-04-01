import { gql } from '@/__generated__'
import { AdminStatementCommentInput } from '../AdminStatementCommentInput'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { AdminActivity } from './AdminActivity'
import { takeRight } from 'lodash'
import { pluralize } from '@/libs/pluralize'

const SHOW_ALL_THRESHOLD = 3

export function AdminStatementComments(props: { statementId: string }) {
  const [showAll, setShowAll] = useState(false)

  const { data, refetch, loading } = useQuery(
    gql(`
      query AdminStatementCommentsQuery($id: Int!) {
        ...AdminStatementCommentInput
        statementV2(id: $id, includeUnpublished: true) {
          activitiesCount
          activities {
            edges {
              node {
                ...AdminActivity
              }
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
    return <div>Nahrávám&hellip;</div>
  }

  const statement = data?.statementV2

  if (!statement) {
    return null
  }

  const activities = showAll
    ? statement.activities.edges
    : takeRight(statement.activities.edges, SHOW_ALL_THRESHOLD)

  return (
    <div className="flow-root">
      {statement.activitiesCount > SHOW_ALL_THRESHOLD && (
        <>
          {showAll ? (
            <a
              className="text-sm text-indigo-600 cursor-pointer"
              onClick={() => setShowAll(false)}
            >
              Zobrazit jen poslední {SHOW_ALL_THRESHOLD} aktivity
            </a>
          ) : (
            <a
              className="text-sm text-indigo-600 cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              Zobrazit 4{' '}
              {pluralize(
                statement.activitiesCount - SHOW_ALL_THRESHOLD,
                'předchozí aktivitu',
                'předchozí aktivity',
                'předchozí aktivity'
              )}
            </a>
          )}
        </>
      )}

      <ul role="list" className="mt-8 -mb-8">
        {activities?.map((activityItem, activityItemIdx: number) => {
          if (!activityItem) {
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
