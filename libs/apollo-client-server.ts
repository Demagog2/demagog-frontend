import {
  ApolloClient,
  from,
  InMemoryCache,
  MutationOptions,
  OperationVariables,
  QueryOptions,
} from '@apollo/client'
import { cookies } from 'next/headers'
import possibleTypes from '@/__generated__/possibleTypes.json'
import type { DefaultContext } from '@apollo/client/core/types'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

export function createServerSideApolloClient() {
  const cookieStore = cookies()

  const ssrMode = typeof window === 'undefined'

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([
      createUploadLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        fetch,
        // credentials: 'include',
        headers: ssrMode
          ? process.env.NODE_ENV === 'production'
            ? {
                // On the server, pass the incoming request's cookies to the outgoing request
                cookie: cookieStore.toString() || '',
              }
            : {
                Authorization:
                  process.env.GRAPHQL_SERVER_AUTHORIZATION_TOKEN ?? '',
              }
          : undefined,
      }),
    ]),
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
