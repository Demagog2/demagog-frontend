'use server'

import { gql } from '@/__generated__'
import {
  EuroClimateDistortion,
  EuroClimateFormat,
  EuroClimateSubtopic,
  EuroClimateTopic,
  ExternalServiceEnum,
  PublishIntegrationArticleMutation,
  PublishIntegrationArticleMutationVariables,
} from '@/__generated__/graphql'
import { serverMutation } from '@/libs/apollo-client-server'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { euroclimateFormSchema } from '@/libs/integrations/Euro-climate-schema'
import { redirect } from 'next/navigation'

const publishIntegrationArticleMutation = gql(`
  mutation PublishIntegrationArticle($input: PublishIntegrationArticleMutationInput!) {
    publishIntegrationArticle(input: $input) {
      ... on PublishIntegrationArticleError {
        message
      }
      ... on PublishIntegrationArticleSuccess {
        article {
          id
        }
      }
    }
  }
`)

export async function publishIntegrationArticle(
  articleId: string,
  service: ExternalServiceEnum
) {
  const { data } = await serverMutation({
    mutation: publishIntegrationArticleMutation,
    variables: {
      input: { articleId, externalService: service },
    },
  })

  if (
    data?.publishIntegrationArticle?.__typename ===
    'PublishIntegrationArticleError'
  ) {
    return { error: true, message: data.publishIntegrationArticle.message }
  }

  if (
    data?.publishIntegrationArticle?.__typename ===
    'PublishIntegrationArticleSuccess'
  ) {
    return { success: true, article: data?.publishIntegrationArticle?.article }
  }

  throw new Error('Unknown response type')
}

export const createEuroClimateArticle = new CreateActionBuilder<
  typeof euroclimateFormSchema,
  PublishIntegrationArticleMutation,
  PublishIntegrationArticleMutationVariables,
  typeof publishIntegrationArticleMutation
>(euroclimateFormSchema)
  .withMutation(publishIntegrationArticleMutation, (data) => {
    return {
      input: {
        articleId: data.articleId,
        externalService: ExternalServiceEnum.EuroClimate,
        euroClimateIntegration: {
          topic: data.topic as EuroClimateTopic,
          subtopics: data.subtopics as EuroClimateSubtopic[],
          distortions: data.distortions as EuroClimateDistortion[],
          appearanceDate: data.appearance.appearanceDate,
          appearanceUrl: data.appearance.appearanceUrl,
          format: data.appearance.format as EuroClimateFormat,
          archiveUrl: data.appearance.archiveUrl,
        },
      },
    }
  })
  .withRedirectUrl((data) => {
    if (
      data.publishIntegrationArticle?.__typename ===
      'PublishIntegrationArticleSuccess'
    ) {
      redirect(
        `/beta/admin/articles/${data?.publishIntegrationArticle?.article?.id}/integrations`
      )
    }

    return null
  })
  .build()

const adminDeleteIntegrationArticleMutation = gql(`
      mutation AdminDeleteIntegrationArticle($input: DeleteIntegrationArticleMutationInput!) {
        deleteIntegrationArticle(input: $input) {
          ... on DeleteIntegrationArticleSuccess {
            article {
              id
            }
          }
          ... on DeleteIntegrationArticleError {
            message
          }
        }
      }
    `)

export async function deleteIntegrationArticle(
  articleId: string,
  externalService: ExternalServiceEnum
) {
  const { data } = await serverMutation({
    mutation: adminDeleteIntegrationArticleMutation,
    variables: {
      input: { articleId, externalService },
    },
  })

  if (
    data?.deleteIntegrationArticle?.__typename ===
    'DeleteIntegrationArticleError'
  ) {
    return { error: true, message: data.deleteIntegrationArticle.message }
  }

  if (
    data?.deleteIntegrationArticle?.__typename ===
    'DeleteIntegrationArticleSuccess'
  ) {
    return { success: true, article: data?.deleteIntegrationArticle?.article }
  }

  throw new Error('Unknown response type')
}
