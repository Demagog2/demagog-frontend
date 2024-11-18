'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { mediumSchema } from '@/libs/media/medium-schema'
import { redirect } from 'next/navigation'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import {
  CreateMediumMutation,
  CreateMediumMutationVariables,
  UpdateMediumMutation,
  UpdateMediumMutationVariables,
} from '@/__generated__/graphql'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'

const adminDeleteMediumMutation = gql(`
  mutation AdminDeleteMedium($id: ID!){
    deleteMedium(id: $id){
      id
    }
  }
`)

export async function deleteMedium(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteMediumMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteMedium?.id) {
    redirect(`/beta/admin/media`)
  }
}

const adminCreateMediumMutation = gql(`
  mutation CreateMedium($mediumInput: MediumInput!) {
    createMedium(mediumInput: $mediumInput) {
      medium {
        id
      }
    }
  }
`)

export const createMedium = new CreateActionBuilder<
  typeof mediumSchema,
  CreateMediumMutation,
  CreateMediumMutationVariables,
  typeof adminCreateMediumMutation
>(mediumSchema)
  .withMutation(adminCreateMediumMutation, (data) => ({
    mediumInput: {
      name: data.name,
    },
  }))
  .withRedirectUrl((data) => {
    if (data?.createMedium?.medium) {
      return `/beta/admin/media/${data?.createMedium?.medium.id}`
    }

    return null
  })
  .build()

const adminUpdateMediumMutation = gql(`
  mutation UpdateMedium($id: ID!, $mediumInput: MediumInput!) {
    updateMedium(id: $id, mediumInput: $mediumInput) {
      medium {
        id
      }
    }
  }
`)

export const updateMedium = new UpdateActionBuilder<
  typeof mediumSchema,
  UpdateMediumMutation,
  UpdateMediumMutationVariables,
  typeof adminUpdateMediumMutation
>(mediumSchema)
  .withMutation(adminUpdateMediumMutation, (id, data) => ({
    id,
    mediumInput: {
      name: data.name,
    },
  }))
  .build()
