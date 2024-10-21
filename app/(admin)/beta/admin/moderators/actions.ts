'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
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
