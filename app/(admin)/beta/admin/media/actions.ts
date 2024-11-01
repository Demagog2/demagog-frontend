'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { safeParse } from '@/libs/form-data'
import { mediumSchema } from '@/libs/media/medium-schema'
import { redirect } from 'next/navigation'
import { parse } from 'path'

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

export async function createMedium(formData: FormData) {
  const parsedInput = safeParse(mediumSchema, formData)

  if (parsedInput.success) {
    const { data } = await serverMutation({
      mutation: adminCreateMediumMutation,
      variables: {
        mediumInput: {
          name: String(formData.get('name')) ?? '',
        },
      },
    })

    if (data?.createMedium?.medium.id) {
      return redirect(`/beta/admin/media/${data.createMedium.medium.id}`)
    }
  }
}
