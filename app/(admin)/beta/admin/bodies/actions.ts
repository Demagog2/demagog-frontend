'use server'

import { gql } from '@/__generated__'
import { schema } from '@/libs/bodies/schema'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import {
  EditBodyMutation,
  EditBodyMutationVariables,
  CreateBodyMutation,
  CreateBodyMutationVariables,
} from '@/__generated__/graphql'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'

const adminCreateBodyMutation = gql(`
  mutation CreateBody($input: BodyInput!) {
    createBody(bodyInput: $input) {
      body {
        id
      }
    }
  }
`)

export const createBody = new CreateActionBuilder<
  typeof schema,
  CreateBodyMutation,
  CreateBodyMutationVariables,
  typeof adminCreateBodyMutation
>(schema)
  .withMutation(adminCreateBodyMutation, (data) => {
    const { isParty = false, isInactive = false, ...rest } = data

    return {
      input: {
        ...rest,
        isParty,
        isInactive,
      },
    }
  })
  .withRedirectUrl((data) => {
    if (data?.createBody?.body) {
      return `/beta/admin/bodies/${data?.createBody?.body.id}`
    }
    return null
  })
  .build()

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

const adminDeleteBodyMutation = gql(`
    mutation AdminDeleteBody($id: ID!) {
      deleteBody(id: $id) {
        id
      }
    }
  `)

export async function deleteBody(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteBodyMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteBody?.id) {
    redirect(`/beta/admin/bodies`)
  }
}
