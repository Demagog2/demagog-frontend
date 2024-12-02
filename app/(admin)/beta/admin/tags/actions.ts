'use server'

import { gql } from '@/__generated__'
import { schema, toStatementType } from '@/libs/tags/schema'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import {
  AdminTagNewMutationMutation,
  AdminTagNewMutationMutationVariables,
  AdminTagUpdateMutationMutation,
  AdminTagUpdateMutationMutationVariables,
} from '@/__generated__/graphql'

const adminCreateTagMutation = gql(`
  mutation AdminTagNewMutation($input: TagInput!) {
    createTag(tagInput: $input) {
      tag {
        id
      }
    }
  }
`)

export const createTag = new CreateActionBuilder<
  typeof schema,
  AdminTagNewMutationMutation,
  AdminTagNewMutationMutationVariables,
  typeof adminCreateTagMutation
>(schema)
  .withMutation(adminCreateTagMutation, (data) => ({
    input: {
      name: data.name,
      forStatementType: toStatementType(data.forStatementType),
    },
  }))
  .withRedirectUrl((data) => {
    if (data.createTag?.tag?.id) {
      return `/beta/admin/tags/${data?.createTag?.tag.id}`
    }

    return null
  })
  .build()

const adminUpdateTagMutation = gql(`
  mutation AdminTagUpdateMutation($input: UpdateTagMutationInput!) {
    updateTag(input: $input) {
      __typename
      ... on UpdateTagSuccess {
        tag {
          id
        }
      }
      ... on UpdateTagError {
        message
      }
    }
  }
`)

export const updateTag = new UpdateActionBuilder<
  typeof schema,
  AdminTagUpdateMutationMutation,
  AdminTagUpdateMutationMutationVariables,
  typeof adminUpdateTagMutation
>(schema)
  .withMutation(adminUpdateTagMutation, (id, data) => ({
    input: {
      id,
      name: data.name,
      forStatementType: toStatementType(data.forStatementType),
    },
  }))
  .build()
