'use server'

import { gql } from '@/__generated__'
import { ExternalServiceEnum } from '@/__generated__/graphql'
import { serverMutation } from '@/libs/apollo-client-server'

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
