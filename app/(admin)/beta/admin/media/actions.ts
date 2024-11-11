'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { safeParse } from '@/libs/form-data'
import { mediumSchema } from '@/libs/media/medium-schema'
import { redirect } from 'next/navigation'
import { FormState } from '@/libs/forms/form-state'
import { FormMessage } from '@/libs/forms/form-message'

const adminDeleteMediumMutation = gql(`
  mutation AdminDeleteMedium($id: ID!){
    deleteMedium(id: $id){
      id
    }
  }
`)

export async function deleteMedium(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteMediumMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteMedium?.id) {
    redirect(`/beta/admin/media`)
  }
}

const adminCreateMediumMutation = gql(`
  mutation CreateMedium($mediumInput: MediumInput!) {
    createMedium(mediumInput: $mediumInput) {
      medium {
        id
      }
    }
  }
`)

export async function createMedium(formData: FormData): Promise<FormState> {
  const parsedInput = safeParse(mediumSchema, formData)

  if (parsedInput.success) {
    const { data } = await serverMutation({
      mutation: adminCreateMediumMutation,
      variables: {
        mediumInput: {
          name: parsedInput.data.name,
        },
      },
    })

    if (data?.createMedium?.medium.id) {
      redirect(`/beta/admin/media/${data.createMedium.medium.id}`)
    }
  }

  return {
    state: 'error',
    fields: {
      ...parsedInput.data,
    },
    message: FormMessage.error.validation,
  }
}

const adminUpdateMediumMutation = gql(`
  mutation UpdateMedium($id: ID!, $mediumInput: MediumInput!) {
    updateMedium(id: $id, mediumInput: $mediumInput) {
      medium {
        id
      }
    }
  }
`)

export async function updateMedium(
  mediumId: string,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(mediumSchema, formData)

  if (parsedInput.success) {
    const { data } = await serverMutation({
      mutation: adminUpdateMediumMutation,
      variables: {
        id: mediumId,
        mediumInput: {
          name: parsedInput.data.name,
        },
      },
    })

    if (data?.updateMedium?.medium.id) {
      redirect(`/beta/admin/media/${data.updateMedium.medium.id}/edit`)
    }
  }

  return {
    state: 'error',
    fields: {
      ...parsedInput.data,
    },
    message: FormMessage.error.validation,
  }
}
