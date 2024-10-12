'use server'

import { serverMutation } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { redirect } from 'next/navigation'

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
    redirect(`/admin/images`)
  }
}
