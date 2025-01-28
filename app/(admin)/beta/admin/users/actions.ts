'use server'
import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'

const adminDeleteUserMutation = gql(`
  mutation AdminDeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
   }
`)

export async function deleteUser(userId: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteUserMutation,
    variables: {
      id: userId,
    },
  })

  if (data?.deleteUser?.id) {
    redirect(`/beta/admin/users`)
  }
}
