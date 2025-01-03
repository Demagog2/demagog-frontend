'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'

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
    redirect(
      `/beta/admin/sources/${data.updateNotification?.notification.statement.source.id}/statements/${data.updateNotification?.notification.statement.id}`
    )
  }

  return {
    type: 'error' as const,
    message: 'Something went wrong',
  }
}

export async function markAsUnread(notificationId: string) {
  toggleReadState(notificationId, null)
}

export async function markAsRead(notificationId: string) {
  toggleReadState(notificationId, new Date().toISOString())
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
    redirect(`/beta/admin/notifications/all`)
  }

  return {
    type: 'error' as const,
    message: 'Something went wrong',
  }
}
