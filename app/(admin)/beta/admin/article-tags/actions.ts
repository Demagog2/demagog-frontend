'use server'

import { gql } from '@/__generated__'
import {
  AdminArticleTagNewMutationMutation,
  AdminArticleTagNewMutationMutationVariables,
} from '@/__generated__/graphql'
import { serverMutation } from '@/libs/apollo-client-server'
import { schema } from '@/libs/article-tags/schema'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { redirect } from 'next/navigation'

const adminCreateArticleTagMutation = gql(`
  mutation AdminArticleTagNewMutation($articleTagInput: ArticleTagInput!){
    createArticleTag(articleTagInput: $articleTagInput) {
      articleTag {
        id
      }
    }
  }
`)

export const createArticleTag = new CreateActionBuilder<
  typeof schema,
  AdminArticleTagNewMutationMutation,
  AdminArticleTagNewMutationMutationVariables,
  typeof adminCreateArticleTagMutation
>(schema)
  .withMutation(adminCreateArticleTagMutation, (data) => {
    const { ...rest } = data
    return {
      articleTagInput: {
        ...rest,
      },
    }
  })
  .withRedirectUrl((data) => {
    if (data?.createArticleTag?.articleTag) {
      return `/beta/admin/article-tags/${data?.createArticleTag?.articleTag.id}`
    }
    return null
  })
  .build()

const adminDeleteArticleTagMutation = gql(`
    mutation AdminDeleteArticleTag($id: ID!){
      deleteArticleTag(id: $id){
        id
      }
    }
  `)

export async function deleteArticleTag(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteArticleTagMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteArticleTag?.id) {
    redirect(`/beta/admin/article-tags`)
  }
}
