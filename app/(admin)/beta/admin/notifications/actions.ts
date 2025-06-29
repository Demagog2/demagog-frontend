'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'

const UpdateNotification = gql(`
  mutation UpdateNotification($id: ID!, $input: UpdateNotificationInput!) {
    updateNotification(id: $id, input: $input) {
      notification {
        id
        statement {
          id
          source {
            id
          }
        }
      }
    }
  }
`)

export async function markAsReadAndRedirect(notificationId: string) {
  const { data } = await serverMutation({
    mutation: UpdateNotification,
    variables: {
      id: notificationId,
      input: {
        readAt: new Date().toISOString(),
      },
    },
  })

  if (data?.updateNotification?.notification) {
    return {
      type: 'success' as const,
      redirectUrl: `/beta/admin/sources/${data.updateNotification?.notification.statement.source.id}/statements/${data.updateNotification?.notification.statement.id}`,
    }
  }

  return {
    type: 'error' as const,
    message: 'Something went wrong',
  }
}

const MarkUnreadNotificationsAsRead = gql(`
  mutation MarkUnreadNotificationsAsRead($statementId: ID) {
    markUnreadNotificationsAsRead(statementId: $statementId) {
      notifications {
        id
        readAt
        statement {
          source {
            id
          }
        }
      }
    }
  }
`)

export async function markStatementNotificationsAsReadAndRedirect(
  statementId: string
) {
  const { data } = await serverMutation({
    mutation: MarkUnreadNotificationsAsRead,
    variables: {
      statementId,
    },
  })

  if (data?.markUnreadNotificationsAsRead?.notifications.length) {
    return {
      type: 'success' as const,
      redirectUrl: `/beta/admin/sources/${data.markUnreadNotificationsAsRead?.notifications?.[0].statement.source.id}/statements/${statementId}`,
    }
  }

  return {
    type: 'error' as const,
    message: 'Something went wrong',
  }
}

type MarkAllNotificationsAsReadResult = { success: boolean }

export async function markAllNotificationsAsRead(): Promise<MarkAllNotificationsAsReadResult> {
  const { data } = await serverMutation({
    mutation: MarkUnreadNotificationsAsRead,
  })

  if (data?.markUnreadNotificationsAsRead?.notifications.length) {
    return {
      success: true,
    }
  } else {
    return { success: false }
  }
}

export async function markAsUnread(notificationId: string) {
  return toggleReadState(notificationId, null)
}

export async function markAsRead(notificationId: string) {
  return toggleReadState(notificationId, new Date().toISOString())
}

async function toggleReadState(notificationId: string, readAt: string | null) {
  const { data } = await serverMutation({
    mutation: UpdateNotification,
    variables: {
      id: notificationId,
      input: {
        readAt,
      },
    },
  })

  if (data?.updateNotification?.notification) {
    return {
      type: 'success' as const,
      redirectUrl: `/beta/admin/notifications/all`,
    }
  }

  return {
    type: 'error' as const,
    message: 'Something went wrong',
  }
}
