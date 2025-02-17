'use server'

import { gql } from '@/__generated__'
import { schema } from '@/libs/bodies/schema'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import {
  EditBodyMutation,
  EditBodyMutationVariables,
} from '@/__generated__/graphql'

const adminEditBodyMutation = gql(`
    mutation EditBody($id: Int!, $bodyInput: BodyInput!) {
      updateBody(id: $id, bodyInput: $bodyInput) {
        body {
         id
        }
      }
    }
  `)

export const editBody = new UpdateActionBuilder<
  typeof schema,
  EditBodyMutation,
  EditBodyMutationVariables,
  typeof adminEditBodyMutation
>(schema)
  .withMutation(adminEditBodyMutation, (id, data) => {
    const { isParty = false, isInactive = false, ...rest } = data

    return {
      id: Number(id),
      bodyInput: {
        ...rest,
        isParty,
        isInactive,
      },
    }
  })
  .build()
