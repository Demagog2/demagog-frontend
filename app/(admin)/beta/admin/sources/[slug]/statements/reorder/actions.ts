'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'

const updateSourceStatementsOrderMutation = gql(`
  mutation UpdateSourceStatementsOrder(
    $id: ID!
    $input: UpdateSourceStatementsOrderInput!
  ) {
    updateSourceStatementsOrder(id: $id, input: $input) {
      source {
        id
      }
    }
  }
`)

export async function updateSourceStatementsOrder(
  sourceId: string,
  statementIds: string[]
) {
  const { data } = await serverMutation({
    mutation: updateSourceStatementsOrderMutation,
    variables: {
      id: sourceId,
      input: {
        orderedStatementIds: statementIds,
      },
    },
  })

  return !!data?.updateSourceStatementsOrder?.source.id
}
