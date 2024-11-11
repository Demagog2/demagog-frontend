import { ZodType } from 'zod'
import { FormState } from '@/libs/forms/form-state'
import { safeParse } from '@/libs/form-data'
import invariant from 'ts-invariant'
import { serverMutation } from '@/libs/apollo-client-server'
import { FormMessage } from '@/libs/forms/form-message'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import * as Sentry from '@sentry/nextjs'
import { redirect } from 'next/navigation'

export class CreateActionBuilder<
  T extends ZodType,
  D,
  V,
  M extends TypedDocumentNode<D, V>,
> {
  private mutation?: M

  private variables?: (input: T['_output']) => V

  private redirectUrl?: (data: D) => string | null

  constructor(private schema: T) {}

  withMutation(mutation: M, variables: (input: T['_output']) => V) {
    this.mutation = mutation
    this.variables = variables

    return this
  }

  withRedirectUrl(redirectUrl: (data: D) => string | null) {
    this.redirectUrl = redirectUrl

    return this
  }

  build() {
    return async (
      _form: FormState,
      formData?: FormData
    ): Promise<FormState> => {
      const parsedInput = safeParse(this.schema, formData)

      if (parsedInput.success) {
        invariant(this.mutation, 'Mutation was not defined')
        invariant(this.variables, 'Variables were not defined')

        const variables = await this.variables(parsedInput.data)

        const { data, errors } = await serverMutation({
          mutation: this.mutation,
          variables: variables as any,
        })

        if (errors?.length) {
          return {
            state: 'error',
            message: FormMessage.error.unknown,
            fields: {
              ...parsedInput.data,
            },
          }
        }

        if (data && this.redirectUrl) {
          const redirectUrl = await this.redirectUrl(data)

          redirectUrl && redirect(redirectUrl)
        }

        return {
          state: 'success',
          message: FormMessage.success,
          fields: {
            ...parsedInput.data,
          },
        }
      }

      Sentry.captureException(parsedInput.error)

      return {
        state: 'error',
        message: FormMessage.error.validation,
        fields: {
          ...(parsedInput.data ?? {}),
        },
      }
    }
  }
}
