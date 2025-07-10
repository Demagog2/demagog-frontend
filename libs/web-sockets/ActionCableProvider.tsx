'use client'

import {
  type PropsWithChildren,
  createContext,
  useMemo,
  useContext,
  useEffect,
} from 'react'
import { Consumer, createConsumer } from '@rails/actioncable'

const ActionCable = createContext<Consumer | null>(null)

export type PresenceUpdated = {
  type: 'presence_updated'
  present_users: {
    id: number
    first_name: string
    last_name: string
    joined_at: string
    display_name: string
    avatar?: string | null
  }[]
}

interface User {
  id: number
  first_name: string
  last_name: string
  display_name: string
  avatar?: string | null
}

interface Comment {
  id: number
  content: string
  created_at: string // ISO8601 format
}

interface Reply {
  id: number
  content: string
  created_at: string // ISO8601 format
}

// Activity metadata for comment creation
interface CommentActivityMetadata {
  comment_id: number
  content: string
  reply_id?: number | null
}

export interface CommentActivity {
  id: number
  activity_type: 'comment_created'
  user: User
  metadata: CommentActivityMetadata
  created_at: string // ISO8601 format
  updated_at: string // ISO8601 format
  comment: Comment
  reply?: Reply
}

export interface ActivityCreatedMessage {
  type: 'activity_created'
  activity: CommentActivity
}

export interface TypingData {
  type: 'user_typing'
  user: User
  is_typing: boolean
}

type StatementChannelMessages =
  | PresenceUpdated
  | ActivityCreatedMessage
  | TypingData

export function useStatementSubscription(
  statementId: string,
  onPresenceUpdated: (message: PresenceUpdated) => void,
  onActivityCreated: (message: ActivityCreatedMessage) => void,
  onTypingData: (message: TypingData) => void
) {
  const consumer = useContext(ActionCable)
  const subscription = useMemo(() => {
    if (!consumer) return null

    return consumer.subscriptions.create(
      {
        channel: 'StatementChannel',
        statement_id: statementId,
      },
      {
        received: (message: StatementChannelMessages) => {
          if (message.type === 'presence_updated') {
            onPresenceUpdated(message)
          }

          if (message.type === 'activity_created') {
            onActivityCreated(message)
          }

          if (message.type === 'user_typing') {
            onTypingData(message)
          }
        },
      }
    )
  }, [
    statementId,
    consumer,
    onPresenceUpdated,
    onActivityCreated,
    onTypingData,
  ])

  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (subscription) {
        subscription.send({ type: 'ping' })
      }
    }, 5000)

    return () => {
      clearInterval(pingInterval)
    }
  }, [subscription])

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [subscription])

  return subscription
}

export function ActionCableProvider(
  props: PropsWithChildren<{ authorizationToken?: string }>
) {
  const { authorizationToken } = props

  const wsUrl = useMemo(() => {
    if (authorizationToken) {
      return `ws://localhost:3000/cable?token=${authorizationToken}`
    }

    return `wss://api.demagog.cz/cable`
  }, [authorizationToken])

  const consumer = useMemo(() => {
    return createConsumer(wsUrl)
  }, [wsUrl])

  return (
    <ActionCable.Provider value={consumer}>
      {props.children}
    </ActionCable.Provider>
  )
}
