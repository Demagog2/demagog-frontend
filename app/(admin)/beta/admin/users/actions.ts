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
  mutation CreateUser($userInput: UserInput!) {
    createUser(userInput: $userInput) {
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
    const { emailNotifications = false, ...rest } = data
    return {
      userInput: {
        ...rest,
        emailNotifications,
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
  mutation UpdateUserMutation($id: Int!, $userInput: UserInput!) {
    updateUser(id: $id, userInput: $userInput) {
      user {
        id
        firstName
        lastName
        email
        emailNotifications
        role {
          name
        }
        userPublic
        avatar
        positionDescription
        bio
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
  .withMutation(
    adminUpdateUserMutation,
    (data: UpdateUserMutationVariables) => {
      return {
        id: Number(data.id),
        userInput: {
          ...data.userInput,
        },
      }
    }
  )
  .build()
