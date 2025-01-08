'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { markAsReadAndRedirect } from '@/app/(admin)/beta/admin/notifications/actions'
import classNames from 'classnames'
import { ToggleReadButton } from './ToggleReadButton'
import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { groupBy, sortBy } from 'lodash'

const NotificationsTableFragment = gql(`
  fragment NotificationsTable on NotificationConnection {
    edges {
      node {
        ...ToggleReadButton
        id
        fullText
        createdAt
        isRead
        statement {
          content
          id
          sourceSpeaker {
            fullName
          }
          source {
            name
          }
        }
      }
    }
  }
`)

export function NotificationsTable(props: {
  notifications: FragmentType<typeof NotificationsTableFragment>
  // TODO: Do we still need withToggleControl? It's seems it's true whenever allNotifications are true, so we can remove it and use allNotifications instead
  withToggleControl?: boolean
  allNotifications: boolean
}) {
  const notifications = useFragment(
    NotificationsTableFragment,
    props.notifications
  )

  const notificationsByStatementId = groupBy(
    notifications.edges?.map((edge) => edge?.node),
    (node) => node?.statement.id
  )

  const sortedStatementKeys = sortBy(
    Object.keys(notificationsByStatementId),
    (statementId) => {
      // Take date of first notification for given statement (which is always the latest one)
      return -notificationsByStatementId[statementId]?.[0]?.createdAt
    }
  )

  return (
    <table className="admin-content-table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {sortedStatementKeys.flatMap((statementId) => {
          const notifications = notificationsByStatementId[statementId]
          return notifications.map((notification, i) => {
            if (!notification) {
              return null
            }
            return (
              <tr
                key={notification.id}
                className={classNames(
                  'text-start hover:bg-gray-50 hover:text-indigo-600 cursor-pointer',
                  { 'bg-blue-100 hover:bg-gray-100': !notification.isRead }
                )}
                onClick={() =>
                  notification && markAsReadAndRedirect(notification.id)
                }
              >
                {props.allNotifications ? (
                  <td className="!whitespace-normal">
                    {notification.fullText}

                    <p className="mt-2 text-sm text-gray-500">
                      {`Vytvořeno ${displayDateTimeRelative(notification.createdAt)} – ${displayDateTime(notification.createdAt)}`}
                    </p>
                  </td>
                ) : (
                  <td className="!whitespace-normal">
                    {i === 0 &&
                      `${notification.statement.sourceSpeaker.fullName}: ${notification.statement.content}`}

                    <p className="mt-2 text-sm text-gray-500">
                      {i === 0 &&
                        `Diskuze: ${notification.statement.source.name}`}
                    </p>
                  </td>
                )}
                <td
                  className={classNames({
                    '!whitespace-normal !text-left': !props.withToggleControl,
                  })}
                >
                  {props.withToggleControl || props.allNotifications ? (
                    <ToggleReadButton notification={notification} />
                  ) : (
                    <>
                      {notification.fullText}
                      <p className="mt-2 text-sm text-gray-500">{`Vytvořeno ${displayDateTimeRelative(notification.createdAt)}
                    - ${displayDateTime(notification.createdAt)}`}</p>
                    </>
                  )}
                </td>
              </tr>
            )
          })
        })}
      </tbody>
    </table>
  )
}
