import { ApolloProvider } from '@apollo/client';
import { FC, ReactNode } from 'react';
import client from '../libs/apollo-client';

interface ApolloProps {
    children?: ReactNode
}

const Apollo = ({ children }: ApolloProps) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default Apollo;