'use client'

import { PropsWithChildren, useMemo } from 'react'
import { createClient } from '@/libs/apollo-client'
import { ApolloProvider } from '@apollo/client'

export function ApolloClientProvider(
  props: PropsWithChildren<{ authorizationToken?: string }>
) {
  const apolloClient = useMemo(
    () => createClient(props.authorizationToken),
    [props.authorizationToken]
  )

  return <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>
}
