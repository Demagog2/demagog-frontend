'use server'

import { serverMutation } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'
import * as Sentry from '@sentry/nextjs'
import { contentImageSchema } from '@/libs/images/schema'

export type FormState = {
  message: string
  error?: string
  fields?: Record<string, any>
}

const adminCreateImageMutation = gql(`
  mutation AdminCreateImageMutation($input: CreateContentImageMutationInput!) {
    createContentImage(input: $input) {
      ... on CreateContentImageSuccess {
        contentImage {
          id
        }
      }
      ... on CreateContentImageError {
        message
      }
    }
  }
`)

export async function createImage(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(contentImageSchema, formData)

  if (parsedInput.success) {
    const input = parsedInput.data

    const { data } = await serverMutation({
      mutation: adminCreateImageMutation,
      variables: {
        input,
      },
    })

    if (data?.createContentImage?.__typename === 'CreateContentImageSuccess') {
      return redirect(
        `/beta/admin/images/${data?.createContentImage?.contentImage.id}`
      )
    }

    if (data?.createContentImage?.__typename === 'CreateContentImageError') {
      Sentry.captureException(data?.createContentImage.message)
    }
  }

  Sentry.captureException(parsedInput.error)

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...parsedInput.data,
    },
  }
}

const adminDeleteImageMutation = gql(`
  mutation AdminDeleteImage($id: ID!) {
    deleteContentImage(id: $id) {
      id
    }
  }
`)

export async function deleteImage(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteImageMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteContentImage?.id) {
    redirect(`/beta/admin/images`)
  }
}
