'use server'

import { gql } from '@/__generated__'
import { schema, singleStatementArticleSchema } from '@/libs/articles/schema'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'
import * as Sentry from '@sentry/nextjs'

const adminCreateArticleMutation = gql(`
  mutation AdminArticleNewMutationV2($input: ArticleInput!) {
    createArticle(articleInput: $input) {
      article {
        id
      }
    }
  }
`)

export type FormState = {
  message: string
  error?: string
  fields?: Record<string, any>
}

export async function createArticle(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(schema, formData)

  if (parsedInput.success) {
    const input = parsedInput.data

    const { data } = await serverMutation({
      mutation: adminCreateArticleMutation,
      variables: {
        input: {
          ...input,
          segments: input.segments ?? [],
        },
      },
    })

    if (data?.createArticle?.article) {
      redirect(`/admin/articles/${data?.createArticle?.article.id}`)
    }
  }

  Sentry.captureException(parsedInput.error)

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...parsedInput.data,
    },
  }
}

export async function createSingleStatementArticle(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(singleStatementArticleSchema, formData)

  if (parsedInput.success) {
    const { data } = await serverMutation({
      mutation: adminCreateArticleMutation,
      variables: {
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

    if (data?.createArticle?.article) {
      redirect(`/admin/articles/${data?.createArticle?.article.id}`)
    }
  }

  Sentry.captureException(parsedInput.error)

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...parsedInput.data,
    },
  }
}

const adminEditArticleMutation = gql(`
  mutation AdminEditArticleMutation($id: ID!, $input: ArticleInput!) {
    updateArticle(id: $id, articleInput: $input) {
      article {
        id
      }
    }
  }
`)

export async function updateArticle(
  articleId: string,
  _: FormState,
  formData: FormData
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
      redirect(`/admin/articles/${data?.updateArticle?.article.id}`)
    }
  }

  Sentry.captureException(parsedInput.error)

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...parsedInput.data,
    },
  }
}

export async function updateArticleSingleStatement(
  articleId: string,
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedInput = safeParse(singleStatementArticleSchema, formData)

  if (parsedInput.success) {
    const { data, errors } = await serverMutation({
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

    console.debug(data)

    if (data?.updateArticle?.article) {
      redirect(`/admin/articles/${data?.updateArticle?.article.id}`)
    }
  }

  Sentry.captureException(parsedInput.error)

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...parsedInput.data,
    },
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
    redirect(`/admin/articles`)
  }
}
