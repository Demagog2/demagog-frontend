'use client'

import formatDate from '@/libs/format-date'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { markAsReadAndRedirect } from '@/app/(admin)/beta/admin/notifications/actions'
import classNames from 'classnames'
import { ToggleReadButton } from './ToggleReadButton'

const NotificationsTableFragment = gql(`
  fragment NotificationsTable on NotificationConnection {
    edges {
      node {
        ...ToggleReadButton
        id
        fullText
        createdAt
        readAt
        statement {
          content
          id
        }
      }
    }
  }
`)

export function NotificationsTable(props: {
  notifications: FragmentType<typeof NotificationsTableFragment>
  withToggleControl?: boolean
}) {
  const notifications = useFragment(
    NotificationsTableFragment,
    props.notifications
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
        {notifications.edges?.map((edge) => {
          if (!edge?.node) {
            return null
          }

          return (
            <tr
              key={edge.node.id}
              className={classNames(
                'text-start hover:bg-gray-50 hover:text-indigo-600 cursor-pointer',
                { 'bg-blue-100 hover:bg-gray-100': !edge.node.readAt }
              )}
              onClick={() => edge.node && markAsReadAndRedirect(edge.node.id)}
            >
              <td className="!whitespace-normal">
                {edge.node.fullText}
                <p className="mt-2 text-sm text-gray-500">
                  Vytvořeno dne {formatDate(edge.node.createdAt)}
                </p>
              </td>
              <td
                className={classNames({
                  '!whitespace-normal': !props.withToggleControl,
                })}
              >
                {props.withToggleControl ? (
                  <ToggleReadButton notification={edge.node} />
                ) : (
                  edge.node.statement.content
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
