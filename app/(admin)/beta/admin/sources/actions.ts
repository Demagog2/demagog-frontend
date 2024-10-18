'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'
import * as Sentry from '@sentry/nextjs'
import { sourceSchema } from '@/libs/sources/source-schema'

const adminCreateSourceMutation = gql(`
  mutation CreateSource($sourceInput: SourceInput!) {
    createSource(sourceInput: $sourceInput) {
      source {
        id
      }
    }
  }
`)

export type FormState = {
  message: string
  error?: string
  fields?: Record<string, any>
}

export async function createSource(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(sourceSchema, formData)

  if (parsedInput.success) {
    const input = parsedInput.data

    const { data } = await serverMutation({
      mutation: adminCreateSourceMutation,
      variables: {
        sourceInput: {
          ...input,
        },
      },
    })

    if (data?.createSource?.source) {
      redirect(`/beta/admin/sources/${data?.createSource?.source.id}`)
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
