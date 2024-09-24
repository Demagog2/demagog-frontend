import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  MutationOptions,
  OperationVariables,
  QueryOptions,
} from '@apollo/client'
import { cookies } from 'next/headers'
import possibleTypes from '@/__generated__/possibleTypes.json'
import type { DefaultContext } from '@apollo/client/core/types'

export function createServerSideApolloClient() {
  const cookieStore = cookies()

  const ssrMode = typeof window === 'undefined'

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    fetch,
    credentials: 'include', // Include cookies in requests
    headers: ssrMode
      ? {
          // On the server, pass the incoming request's cookies to the outgoing request
          cookie: cookieStore.toString() || '',
        }
      : undefined,
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([httpLink]),
    cache: new InMemoryCache({
      possibleTypes: possibleTypes,
    }),
  })
}

export async function serverQuery<
  T = any,
  TVariables extends OperationVariables = OperationVariables,
>(options: QueryOptions<TVariables, T>) {
  const client = createServerSideApolloClient()

  return client.query(options)
}

export async function serverMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TContext extends Record<string, any> = DefaultContext,
>(options: MutationOptions<TData, TVariables, TContext>) {
  const client = createServerSideApolloClient()

  return client.mutate(options)
}
