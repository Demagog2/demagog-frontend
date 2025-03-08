'use server'

import { gql } from '@/__generated__'
import {
  UpdateSourceVideoFieldsMutation,
  UpdateSourceVideoFieldsMutationVariables,
  UpdateStatementVideoMarksMutation,
  UpdateStatementVideoMarksMutationVariables,
} from '@/__generated__/graphql'
import { serverMutation } from '@/libs/apollo-client-server'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import {
  sourceVideoSchema,
  statementVideoMarksSchema,
} from '@/libs/schemas/sourceVideo'

const updateSourceVideoFieldsMutation = gql(`
  mutation UpdateSourceVideoFields(
    $id: ID!
    $sourceVideoFieldsInput: SourceInputVideoFields!
  ) {
    updateSourceVideoFields(
      id: $id
      sourceVideoFieldsInput: $sourceVideoFieldsInput
    ) {
      source {
        id
        videoType
        videoId
      }
    }
  }
`)

export const updateSourceVideoFields = new UpdateActionBuilder<
  typeof sourceVideoSchema,
  UpdateSourceVideoFieldsMutation,
  UpdateSourceVideoFieldsMutationVariables,
  typeof updateSourceVideoFieldsMutation
>(sourceVideoSchema)
  .withMutation(updateSourceVideoFieldsMutation, (id, input) => ({
    id,
    sourceVideoFieldsInput: {
      videoType: input.video_type,
      videoId: input.video_id,
    },
  }))
  .build()

const updateStatementVideoMarksMutation = gql(`
  mutation UpdateStatementVideoMarks($id: ID!, $statementVideoMarksInput: [StatementsVideoMarksInput!]!) {
    updateStatementsVideoMarks(id: $id, statementsVideoMarksInput: $statementVideoMarksInput) {
      statements {
        id
      }
    }
  }
`)

export const updateStatementVideoMarks = new UpdateActionBuilder<
  typeof statementVideoMarksSchema,
  UpdateStatementVideoMarksMutation,
  UpdateStatementVideoMarksMutationVariables,
  typeof updateStatementVideoMarksMutation
>(statementVideoMarksSchema)
  .withMutation(updateStatementVideoMarksMutation, (id, input) => ({
    id,
    statementVideoMarksInput: input.marks,
  }))
  .build()

export async function clearSourceVideoFields(sourceId: string) {
  await serverMutation({
    mutation: updateSourceVideoFieldsMutation,
    variables: {
      id: sourceId,
      sourceVideoFieldsInput: {
        videoType: '',
        videoId: '',
      },
    },
  })

  return { state: 'success' as const }
}
