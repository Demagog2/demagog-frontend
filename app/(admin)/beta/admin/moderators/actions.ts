'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { safeParse } from '@/libs/form-data'
import { mediaPersonalitySchema } from '@/libs/media-personality/media-personality-schema'
import { redirect } from 'next/navigation'

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

export async function createModerator(formData: FormData) {
  const parsedInput = safeParse(mediaPersonalitySchema, formData)

  if (parsedInput.success) {
    const { data } = await serverMutation({
      mutation: adminCreateMediaPersonalityMutation,
      variables: {
        mediaPersonalityInput: {
          name: String(formData.get('name')) ?? '',
        },
      },
    })

    if (data?.createMediaPersonality?.mediaPersonality.id) {
      return redirect(
        `/beta/admin/moderator/${data.createMediaPersonality.mediaPersonality.id}`
      )
    }
  }
}
