'use server'
import { gql } from '@/__generated__'
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from '@/__generated__/graphql'
import { serverMutation } from '@/libs/apollo-client-server'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import { userSchema } from '@/libs/users/user-schema'
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

const adminCreateUserMutation = gql(`
  mutation CreateUser($input: UserInput!) {
    createUser(userInput: $input) {
      user {
        id
      }
    }
  }
`)

export const createUser = new CreateActionBuilder<
  typeof userSchema,
  CreateUserMutation,
  CreateUserMutationVariables,
  typeof adminCreateUserMutation
>(userSchema)
  .withMutation(adminCreateUserMutation, (data) => {
    const { emailNotifications = false, userPublic = false, ...rest } = data

    return {
      input: {
        ...rest,
        emailNotifications,
        userPublic,
      },
    }
  })
  .withRedirectUrl((data) => {
    if (data?.createUser?.user) {
      return `/beta/admin/users/${data?.createUser?.user.id}`
    }

    return null
  })
  .build()

const adminUpdateUserMutation = gql(`
  mutation UpdateUser($id: Int!, $input: UserInput!) {
    updateUser(id: $id, userInput: $input) {
      user {
        id
      }
    }
  }
`)

export const updateUser = new UpdateActionBuilder<
  typeof userSchema,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  typeof adminUpdateUserMutation
>(userSchema)
  .withMutation(adminUpdateUserMutation, (id, data) => {
    const { emailNotifications = false, userPublic = false, ...rest } = data

    return {
      id: Number(id),
      input: {
        ...rest,
        emailNotifications,
        userPublic,
      },
    }
  })
  .build()
