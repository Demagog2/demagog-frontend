'use server'

import { gql } from '@/__generated__'
import { schema, singleStatementArticleSchema } from '@/libs/articles/schema'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'
import * as Sentry from '@sentry/nextjs'
import { FormState } from '@/libs/forms/form-state'
import { FormMessage } from '@/libs/forms/form-message'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import {
  AdminArticleNewMutationV2Mutation,
  AdminArticleNewMutationV2MutationVariables,
} from '@/__generated__/graphql'

const adminCreateArticleMutation = gql(`
  mutation AdminArticleNewMutationV2($input: ArticleInput!) {
    createArticle(articleInput: $input) {
      article {
        id
      }
    }
  }
`)

export const createArticle = new CreateActionBuilder<
  typeof schema,
  AdminArticleNewMutationV2Mutation,
  AdminArticleNewMutationV2MutationVariables,
  typeof adminCreateArticleMutation
>(schema)
  .withMutation(adminCreateArticleMutation, (data) => ({
    input: {
      ...data,
      segments: data.segments ?? [],
    },
  }))
  .withRedirectUrl((data) => {
    if (data.createArticle?.article.id) {
      redirect(`/beta/admin/articles/${data?.createArticle?.article.id}`)
    }

    return null
  })
  .build()

export const createSingleStatementArticle = new CreateActionBuilder<
  typeof singleStatementArticleSchema,
  AdminArticleNewMutationV2Mutation,
  AdminArticleNewMutationV2MutationVariables,
  typeof adminCreateArticleMutation
>(singleStatementArticleSchema)
  .withMutation(adminCreateArticleMutation, (data) => ({
    input: {
      ...data,
      statementId: undefined,
      articleType: 'single_statement' as const,
      segments: [
        {
          segmentType: 'single_statement' as const,
          statementId: data.statementId,
        },
      ],
    },
  }))
  .withRedirectUrl((data) => {
    if (data?.createArticle?.article) {
      redirect(`/beta/admin/articles/${data?.createArticle?.article.id}`)
    }

    return null
  })
  .build()

const adminEditArticleMutation = gql(`
  mutation AdminEditArticleMutation($id: ID!, $input: ArticleInput!) {
    updateArticle(id: $id, articleInput: $input) {
      article {
        id
        title
      }
    }
  }
`)

export async function updateArticle(
  articleId: string,
  _: FormState,
  formData?: FormData
): Promise<FormState> {
  const parsedInput = safeParse(schema, formData)

  if (parsedInput.success) {
    const input = parsedInput.data

    const { data } = await serverMutation({
      mutation: adminEditArticleMutation,
      variables: {
        id: articleId,
        input: {
          ...input,
          segments: input.segments ?? [],
        },
      },
    })

    if (data?.updateArticle?.article) {
      return {
        state: 'success',
        message: `Článek "${data?.updateArticle.article.title}" úspěšně uložen.`,
        fields: {},
      }
    }
  }

  Sentry.captureException(parsedInput.error)

  return {
    state: 'error',
    message: parsedInput.error?.message ?? FormMessage.error.validation,
    fields: {
      ...parsedInput.data,
    },
  }
}

export async function updateArticleSingleStatement(
  articleId: string,
  _: FormState,
  formData?: FormData
): Promise<FormState> {
  const parsedInput = safeParse(singleStatementArticleSchema, formData)

  // Remove illustration which has a File value, otherwise we can't sent the fields back to the client
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { illustration, ...fields } = parsedInput.data ?? {}

  if (parsedInput.success) {
    const { data } = await serverMutation({
      mutation: adminEditArticleMutation,
      variables: {
        id: articleId,
        input: {
          ...parsedInput.data,
          statementId: undefined,
          articleType: 'single_statement' as const,
          segments: [
            {
              segmentType: 'single_statement' as const,
              statementId: parsedInput.data.statementId,
            },
          ],
        },
      },
    })

    if (data?.updateArticle?.article?.id) {
      return {
        state: 'success',
        message: `Článek "${data?.updateArticle.article.title}" úspěšně uložen.`,
        fields,
      }
    }

    return {
      state: 'error',
      message: FormMessage.error.unknown,
      fields,
    }
  }

  Sentry.captureException(parsedInput.error)

  return {
    state: 'error',
    message: FormMessage.error.validation,
    fields,
  }
}

const adminDeleteArticleMutation = gql(`
  mutation AdminDeleteArticle($id: ID!) {
    deleteArticle(id: $id) {
      id
    }
  }
`)

export async function deleteArticle(id: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteArticleMutation,
    variables: {
      id,
    },
  })

  if (data?.deleteArticle?.id) {
    redirect(`/beta/admin/articles`)
  }
}
