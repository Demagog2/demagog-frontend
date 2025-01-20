import {
  ApolloClient,
  InMemoryCache,
  OperationVariables,
  QueryOptions,
} from '@apollo/client'
import possibleTypes from '@/__generated__/possibleTypes.json'

export function getAuthorizationToken() {
  return process.env.NODE_ENV === 'production'
    ? undefined
    : process.env.GRAPHQL_SERVER_AUTHORIZATION_TOKEN
}

export function createClient(authorizationToken?: string) {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache({
      possibleTypes: possibleTypes,
    }),
    ...(authorizationToken
      ? {
          headers: {
            Authorization: authorizationToken,
          },
        }
      : { credentials: 'include' }),
  })
}

export async function query<
  T = any,
  TVariables extends OperationVariables = OperationVariables,
>(options: QueryOptions<TVariables, T>) {
  const client = createClient()

  return client.query(options)
}
