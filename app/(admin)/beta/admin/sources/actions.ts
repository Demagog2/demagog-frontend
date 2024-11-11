'use server'

import { gql } from '@/__generated__'
import { sourceSchema } from '@/libs/sources/source-schema'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import {
  CreateSourceMutation,
  CreateSourceMutationVariables,
  UpdateSourceMutation,
  UpdateSourceMutationVariables,
} from '@/__generated__/graphql'

const adminCreateSourceMutation = gql(`
  mutation CreateSource($sourceInput: SourceInput!) {
    createSource(sourceInput: $sourceInput) {
      source {
        id
      }
    }
  }
`)

export const createSource = new CreateActionBuilder<
  typeof sourceSchema,
  CreateSourceMutation,
  CreateSourceMutationVariables,
  typeof adminCreateSourceMutation
>(sourceSchema)
  .withMutation(adminCreateSourceMutation, (data) => ({
    sourceInput: {
      ...data,
    },
  }))
  .withRedirectUrl((data) => {
    if (data?.createSource?.source) {
      return `/beta/admin/sources/${data?.createSource?.source.id}`
    }

    return null
  })
  .build()

const adminUpdateSourceMutation = gql(`
  mutation UpdateSource($id: ID!, $sourceInput: SourceInput!) {
    updateSource(id: $id, sourceInput: $sourceInput) {
      source {
        id
      }
    }
  }
`)

export const updateSource = new UpdateActionBuilder<
  typeof sourceSchema,
  UpdateSourceMutation,
  UpdateSourceMutationVariables,
  typeof adminUpdateSourceMutation
>(sourceSchema)
  .withMutation(adminUpdateSourceMutation, (id, input) => ({
    id,
    sourceInput: {
      ...input,
      sourceSpeakers:
        input.sourceSpeakers?.map(({ sourceSpeakerId, ...sourceSpeaker }) => ({
          id: sourceSpeakerId,
          ...sourceSpeaker,
        })) ?? [],
      experts: input.experts ?? [],
    },
  }))
  .build()
