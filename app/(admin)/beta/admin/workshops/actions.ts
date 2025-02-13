'use server'
import { gql } from '@/__generated__'
import {
  CreateWorkshopMutation,
  CreateWorkshopMutationVariables,
} from '@/__generated__/graphql'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
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
