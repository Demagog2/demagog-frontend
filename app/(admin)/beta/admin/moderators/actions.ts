'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { safeParse } from '@/libs/form-data'
import { mediaPersonalitySchema } from '@/libs/media-personality/media-personality-schema'
import { redirect } from 'next/navigation'
import { FormState } from '@/libs/forms/form-state'
import { FormMessage } from '@/libs/forms/form-message'

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

export async function createModerator(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
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
        `/beta/admin/moderators/${data.createMediaPersonality.mediaPersonality.id}`
      )
    }
  }

  return {
    state: 'error',
    message: FormMessage.error.validation,
    fields: {
      ...parsedInput.data,
    },
  }
}
