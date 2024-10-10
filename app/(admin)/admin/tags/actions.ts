'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'
import { schema } from '@/libs/tags/schema'

const adminCreateTagMutation = gql(`
  mutation AdminTagNewMutation($input: TagInput!) {
    createTag(tagInput: $input) {
      tag {
        id
      }
    }
  }
`)

const adminUpdateTagMutation = gql(`
  mutation AdminTagUpdateMutation($input: UpdateTagMutationInput!) {
    updateTag(input: $input) {
      __typename
      ... on UpdateTagSuccess {
        tag {
          id
        }
      }
      ... on UpdateTagError {
        message
      }
    }
  }
`)

export type FormState = {
  message: string
  error?: string
  fields?: Record<string, any>
}

export async function createTag(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(schema, formData)

  if (parsedInput.success) {
    const input = parsedInput.data

    const { data } = await serverMutation({
      mutation: adminCreateTagMutation,
      variables: {
        input: {
          ...input,
        },
      },
    })

    if (data?.createTag?.tag) {
      redirect(`/admin/tags/${data?.createTag?.tag.id}`)
    }
  }

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...parsedInput.data,
    },
  }
}

export async function updateTag(
  tagId: string,
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(schema, formData)

  if (parsedInput.success) {
    const input = parsedInput.data

    const { data } = await serverMutation({
      mutation: adminUpdateTagMutation,
      variables: {
        input: {
          id: tagId,
          ...input,
        },
      },
    })

    if (data?.updateTag?.__typename === 'UpdateTagSuccess') {
      return redirect(`/admin/tags/${data?.updateTag?.tag.id}`)
    }

    return {
      message: 'There was a problem with saving the data to the server.',
      error: data?.updateTag?.message,
      fields: {
        ...parsedInput.data,
      },
    }
  }

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...(parsedInput.data ?? {}),
    },
  }
}
