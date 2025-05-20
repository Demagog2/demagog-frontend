'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import {
  AdminCreateSpeakerMutation,
  AdminCreateSpeakerMutationVariables,
  AdminUpdateSpeakerMutation,
  AdminUpdateSpeakerMutationVariables,
} from '@/__generated__/graphql'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import { speakerSchema } from '@/libs/speakers/speaker-schema'

const adminDeleteSpeakerMutation = gql(`
  mutation AdminDeleteSpeaker($id: ID!) {
    deleteSpeaker(id: $id) {
      id
    }
  }
`)

export async function deleteSpeaker(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteSpeakerMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteSpeaker?.id) {
    redirect(`/beta/admin/speakers`)
  }
}

const adminCreateSpeakerMutation = gql(`
  mutation AdminCreateSpeaker($speakerInput: SpeakerInput!) {
    createSpeaker(speakerInput: $speakerInput) {
      speaker {
        id
      }
    }
  }
`)

export const createSpeaker = new CreateActionBuilder<
  typeof speakerSchema,
  AdminCreateSpeakerMutation,
  AdminCreateSpeakerMutationVariables,
  typeof adminCreateSpeakerMutation
>(speakerSchema)
  .withMutation(adminCreateSpeakerMutation, (data) => {
    const { memberships = [], ...rest } = data

    return {
      speakerInput: {
        ...rest,
        memberships,
      },
    }
  })
  .withRedirectUrl((data) => {
    if (data?.createSpeaker?.speaker?.id) {
      return `/beta/admin/speakers/${data.createSpeaker.speaker.id}`
    }

    return null
  })
  .build()

const adminUpdateSpeakerMutation = gql(`
  mutation AdminUpdateSpeaker($id: ID!, $speakerInput: SpeakerInput!) {
    updateSpeaker(id: $id, speakerInput: $speakerInput) {
      speaker {
        id
        avatar
      }
    }
  }
`)

export const updateSpeaker = new UpdateActionBuilder<
  typeof speakerSchema,
  AdminUpdateSpeakerMutation,
  AdminUpdateSpeakerMutationVariables,
  typeof adminUpdateSpeakerMutation
>(speakerSchema)
  .withMutation(adminUpdateSpeakerMutation, (id, data) => {
    const { memberships = [], ...rest } = data

    return {
      id,
      speakerInput: {
        ...rest,
        memberships,
      },
    }
  })
  .build()
