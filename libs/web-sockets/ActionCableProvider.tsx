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
  }[]
}

type StatementChannelMessages = PresenceUpdated

export function useStatementSubscription(
  statementId: string,
  onPresenceUpdated: (message: PresenceUpdated) => void
) {
  const consumer = useContext(ActionCable)

  useEffect(() => {
    const subscription = consumer?.subscriptions.create(
      {
        channel: 'StatementChannel',
        statement_id: statementId,
      },
      {
        received: (message: StatementChannelMessages) => {
          if (message.type === 'presence_updated') {
            onPresenceUpdated(message)
          }
        },
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [statementId, consumer, onPresenceUpdated])
}

export function ActionCableProvider(
  props: PropsWithChildren<{ authorizationToken?: string }>
) {
  const { authorizationToken } = props

  const wsUrl = useMemo(() => {
    if (authorizationToken) {
      return `ws://localhost:3000/cable?token=${authorizationToken}`
    }

    return `ws://api.demagog.cz/cable`
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
