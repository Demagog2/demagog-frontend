import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  OperationVariables,
  QueryOptions,
} from '@apollo/client'
import { cookies } from 'next/headers'
import possibleTypes from '@/__generated__/possibleTypes.json'

export function createClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache({
      possibleTypes: possibleTypes,
    }),
  })
}

export function createAdminClient() {
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

export async function adminQuery<
  T = any,
  TVariables extends OperationVariables = OperationVariables,
>(options: QueryOptions<TVariables, T>) {
  const client = createAdminClient()

  return client.query(options)
}

export async function query<
  T = any,
  TVariables extends OperationVariables = OperationVariables,
>(options: QueryOptions<TVariables, T>) {
  const client = createClient()

  return client.query(options)
}
