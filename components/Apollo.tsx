'use client'

import { ApolloProvider } from '@apollo/client'
import { ReactNode } from 'react'
import { createClient } from '../libs/apollo-client'

interface ApolloProps {
  children?: ReactNode
}

const Apollo = ({ children }: ApolloProps) => (
  <ApolloProvider client={createClient()}>{children}</ApolloProvider>
)

export default Apollo
