'use server'

import { gql } from '@/__generated__'
import { schema } from '@/libs/articles/schema'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'
import { safeParse } from '@/libs/form-data'

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
  prevState: FormState,
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

  return {
    message: 'There was a problem.',
    error: parsedInput.error?.message,
    fields: {
      ...parsedInput.data,
    },
  }
}
