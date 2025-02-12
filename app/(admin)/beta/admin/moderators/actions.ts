'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { mediaPersonalitySchema } from '@/libs/media-personality/media-personality-schema'
import { redirect } from 'next/navigation'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import {
  CreateMediaPersonalityMutation,
  CreateMediaPersonalityMutationVariables,
  UpdateMediaPersonalityMutation,
  UpdateMediaPersonalityMutationVariables,
} from '@/__generated__/graphql'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'

const adminDeleteMediaPersonalityMutation = gql(`
  mutation AdminDeleteMediaPersonality($id: ID!) {
    deleteMediaPersonality(id: $id) {
      id
    }
  }
`)

export async function deleteMediaPersonality(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteMediaPersonalityMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteMediaPersonality?.id) {
    redirect(`/beta/admin/moderators`)
  }
}

const adminCreateMediaPersonalityMutation = gql(`
  mutation CreateMediaPersonality($mediaPersonalityInput: MediaPersonalityInput!) {
    createMediaPersonality(mediaPersonalityInput: $mediaPersonalityInput) {
      mediaPersonality {
        id
      }
    }
  }
`)

export const createModerator = new CreateActionBuilder<
  typeof mediaPersonalitySchema,
  CreateMediaPersonalityMutation,
  CreateMediaPersonalityMutationVariables,
  typeof adminCreateMediaPersonalityMutation
>(mediaPersonalitySchema)
  .withMutation(adminCreateMediaPersonalityMutation, (data) => {
    return {
      mediaPersonalityInput: {
        name: data.name,
      },
    }
  })
  .withRedirectUrl((data) => {
    if (data?.createMediaPersonality?.mediaPersonality?.id) {
      return `/beta/admin/moderators/${data.createMediaPersonality.mediaPersonality.id}`
    }

    return null
  })
  .build()

const adminUpdateMediaPersonalityMutation = gql(`
  mutation UpdateMediaPersonality($id: ID!, $mediaPersonalityInput: MediaPersonalityInput!) {
    updateMediaPersonality(id: $id, mediaPersonalityInput: $mediaPersonalityInput) {
      mediaPersonality {
        id
      }
    }
  }
`)

export const updateModerator = new UpdateActionBuilder<
  typeof mediaPersonalitySchema,
  UpdateMediaPersonalityMutation,
  UpdateMediaPersonalityMutationVariables,
  typeof adminUpdateMediaPersonalityMutation
>(mediaPersonalitySchema)
  .withMutation(adminUpdateMediaPersonalityMutation, (id, data) => ({
    id,
    mediaPersonalityInput: {
      name: data.name,
    },
  }))
  .build()
