'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'
import { schema, toStatementType } from '@/libs/tags/schema'
import { StatementType } from '@/__generated__/graphql'

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
          name: input.name,
          forStatementType: toStatementType(input.forStatementType),
        },
      },
    })

    if (data?.createTag?.tag) {
      redirect(`/beta/admin/tags/${data?.createTag?.tag.id}`)
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
          name: input.name,
          forStatementType: toStatementType(input.forStatementType),
        },
      },
    })

    if (data?.updateTag?.__typename === 'UpdateTagSuccess') {
      return redirect(`/beta/admin/tags/${data?.updateTag?.tag.id}`)
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
