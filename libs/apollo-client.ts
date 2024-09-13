import {
  ApolloClient,
  InMemoryCache,
  OperationVariables,
  QueryOptions,
} from '@apollo/client'
import possibleTypes from '@/__generated__/possibleTypes.json'

function createClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache({
      possibleTypes: possibleTypes,
    }),
  })
}

export async function query<
  T = any,
  TVariables extends OperationVariables = OperationVariables,
>(options: QueryOptions<TVariables, T>) {
  const client = createClient()

  return client.query(options)
}
