'use server'

import { gql } from '@/__generated__'
import {
  UpdateSourceVideoFieldsMutation,
  UpdateSourceVideoFieldsMutationVariables,
} from '@/__generated__/graphql'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import { sourceVideoSchema } from '@/libs/schemas/sourceVideo'

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
