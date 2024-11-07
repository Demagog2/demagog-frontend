'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'
import * as Sentry from '@sentry/nextjs'
import { sourceSchema } from '@/libs/sources/source-schema'
import { z } from 'zod'

export type FormState = {
  message: string
  error?: string
  fields?: Record<string, any>
}

const adminCreateSourceMutation = gql(`
  mutation CreateSource($sourceInput: SourceInput!) {
    createSource(sourceInput: $sourceInput) {
      source {
        id
      }
    }
  }
`)

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

const adminUpdateSourceMutation = gql(`
  mutation UpdateSource($id: ID!, $sourceInput: SourceInput!) {
    updateSource(id: $id, sourceInput: $sourceInput) {
      source {
        id
      }
    }
  }
`)

export async function updateSource(
  id: string,
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(sourceSchema, formData)

  if (parsedInput.success) {
    // TODO: Should the "as" be necessary?
    const input = parsedInput.data as z.output<typeof sourceSchema>

    const { data } = await serverMutation({
      mutation: adminUpdateSourceMutation,
      variables: {
        id,
        sourceInput: {
          ...input,
          sourceSpeakers:
            input.sourceSpeakers?.map(
              ({ sourceSpeakerId, ...sourceSpeaker }) => ({
                id: sourceSpeakerId,
                ...sourceSpeaker,
              })
            ) ?? [],
          experts: input.experts ?? [],
        },
      },
    })

    if (data?.updateSource?.source) {
      redirect(`/beta/admin/sources/${data?.updateSource?.source.id}`)
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
