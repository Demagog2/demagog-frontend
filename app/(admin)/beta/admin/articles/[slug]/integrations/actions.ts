'use server'

import { gql } from '@/__generated__'
import {
  EuroClimateFormat,
  EuroClimateSubtopic,
  EuroClimateTopic,
  ExternalServiceEnum,
  PublishIntegrationArticleMutation,
  PublishIntegrationArticleMutationVariables,
} from '@/__generated__/graphql'
import { serverMutation } from '@/libs/apollo-client-server'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
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
          integrations {
            euroClimate {
              externalId
            }
            efcsn {
              externalId
            }
          }
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

export const createEuroClimateArticle = new UpdateActionBuilder<
  typeof euroclimateFormSchema,
  PublishIntegrationArticleMutation,
  PublishIntegrationArticleMutationVariables,
  typeof publishIntegrationArticleMutation
>(euroclimateFormSchema)
  .withMutation(publishIntegrationArticleMutation, (id, data) => {
    // TODO: Add distortion type and replace data.appearances[0] with data.appearance once the schema is updated

    return {
      input: {
        articleId: id,
        externalService: ExternalServiceEnum.EuroClimate,
        euroClimateIntegration: {
          ...data,
          topic: data.topic as EuroClimateTopic,
          subtopics: data.subtopics as EuroClimateSubtopic[],
          // distortionType: data.distortionType as EuroClimateDistortionType,
          appearanceDate: data.appearances[0].appearanceDate,
          appearanceUrl: data.appearances[0].appearanceUrl,
          format: data.appearances[0].format as EuroClimateFormat,
          archiveUrl: data.appearances[0].archiveUrl,
        },
      },
    }
  })
  .build()
