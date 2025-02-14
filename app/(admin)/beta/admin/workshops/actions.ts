'use server'
import { gql } from '@/__generated__'
import {
  CreateWorkshopMutation,
  CreateWorkshopMutationVariables,
  UpdateWorkshopMutation,
  UpdateWorkshopMutationVariables,
} from '@/__generated__/graphql'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import { workshopSchema } from '@/libs/workshops/workshop-schema'

const adminCreateWorkshopMutation = gql(`
  mutation CreateWorkshop($input: CreateWorkshopMutationInput!) {
    createWorkshop(input: $input) {
      ... on CreateWorkshopSuccess {
        workshop {
         id
        }
      }

      ... on CreateWorkshopError {
        message
      }
    }
  }
`)

export const createWorkshop = new CreateActionBuilder<
  typeof workshopSchema,
  CreateWorkshopMutation,
  CreateWorkshopMutationVariables,
  typeof adminCreateWorkshopMutation
>(workshopSchema)
  .withMutation(adminCreateWorkshopMutation, (data) => ({
    input: data,
  }))
  .withRedirectUrl((data) => {
    if (data.createWorkshop?.__typename === 'CreateWorkshopSuccess') {
      return `/beta/admin/workshops/${data.createWorkshop.workshop.id}`
    }

    return null
  })
  .build()

const adminUpdateWorkshopMutation = gql(`
    mutation UpdateWorkshop($input: UpdateWorkshopMutationInput!) {
      updateWorkshop(input: $input) {
        ... on UpdateWorkshopSuccess {
          workshop {
            id
          }
        }
        ... on UpdateWorkshopError {
          message
        }
      }
    }
  `)

export const updateWorkshop = new UpdateActionBuilder<
  typeof workshopSchema,
  UpdateWorkshopMutation,
  UpdateWorkshopMutationVariables,
  typeof adminUpdateWorkshopMutation
>(workshopSchema)
  .withMutation(adminUpdateWorkshopMutation, (id, data) => ({
    input: {
      id,
      ...data,
    },
  }))
  .build()
