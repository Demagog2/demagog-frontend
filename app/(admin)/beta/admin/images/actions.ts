'use server'

import { serverMutation } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { contentImageSchema } from '@/libs/images/schema'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import {
  AdminCreateImageMutationMutation,
  AdminCreateImageMutationMutationVariables,
} from '@/__generated__/graphql'

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

export const createImage = new CreateActionBuilder<
  typeof contentImageSchema,
  AdminCreateImageMutationMutation,
  AdminCreateImageMutationMutationVariables,
  typeof adminCreateImageMutation
>(contentImageSchema)
  .withMutation(adminCreateImageMutation, (data) => ({
    input: {
      image: data.image,
    },
  }))
  .withRedirectUrl((data) => {
    if (data?.createContentImage?.__typename === 'CreateContentImageSuccess') {
      return redirect(
        `/beta/admin/images/${data.createContentImage.contentImage.id}`
      )
    }

    return null
  })
  .onError((data) => {
    if (data?.createContentImage?.__typename === 'CreateContentImageError') {
      Sentry.captureException(data.createContentImage.message)
    }
  })
  .build()

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
