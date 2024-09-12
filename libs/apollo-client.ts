import { ApolloClient, InMemoryCache } from '@apollo/client'
import possibleTypes from '@/__generated__/possibleTypes.json'

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache({
    possibleTypes: possibleTypes,
  }),
})

/**
 * Experimental – invalidate server side rendered segments each 60 seconds.
 */
export const CACHING_CONFIG = {
  context: {
    fetchOptions: {
      next: { revalidate: 60 },
    },
  },
}

export default client
