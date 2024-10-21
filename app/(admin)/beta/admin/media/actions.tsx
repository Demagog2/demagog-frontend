'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'

const adminDeleteMediumMutation = gql(`
  mutation AdminDeleteMedium($id: ID!) {
    deleteMedium(id: $id) {
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
    redirect(`/beta/admin/moderators`)
  }
}
