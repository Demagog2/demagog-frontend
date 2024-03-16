import { ApolloClient, InMemoryCache } from '@apollo/client'
import possibleTypes from '@/__generated__/possibleTypes.json'

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache({
    possibleTypes: possibleTypes,
  }),
})

export default client
