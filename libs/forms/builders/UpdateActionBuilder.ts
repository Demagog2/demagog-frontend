import { ZodType } from 'zod'
import { FormState } from '@/libs/forms/form-state'
import { safeParse } from '@/libs/form-data'
import invariant from 'ts-invariant'
import { serverMutation } from '@/libs/apollo-client-server'
import { FormMessage } from '@/libs/forms/form-message'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { ApolloError } from '@apollo/client'
import { omit } from 'lodash'

export class UpdateActionBuilder<
  T extends ZodType,
  D,
  V,
  M extends TypedDocumentNode<D, V>,
> {
  private mutation?: M

  private variables?: (id: string, input: T['_output']) => V

  private removedFormFields: Array<keyof T['_output']> = []

  constructor(private schema: T) {}

  withMutation(mutation: M, variables: (id: string, input: T['_output']) => V) {
    this.mutation = mutation
    this.variables = variables

    return this
  }

  removeFormFields(...fields: Array<keyof T['_output']>) {
    this.removedFormFields = fields

    return this
  }

  getFormFields(data: T['_output']) {
    return omit(data, this.removedFormFields)
  }

  build() {
    return async (
      id: string,
      _form: FormState,
      formData?: FormData
    ): Promise<FormState> => {
      const parsedInput = safeParse(this.schema, formData)

      if (parsedInput.success) {
        invariant(this.mutation, 'Mutation was not defined')
        invariant(this.variables, 'Variables were not defined')

        try {
          const { errors } = await serverMutation({
            mutation: this.mutation,
            variables: (await this.variables(id, parsedInput.data)) as any,
          })

          if (errors?.length) {
            return {
              state: 'error',
              message: FormMessage.error.unknown,
              fields: this.getFormFields(parsedInput.data),
            }
          }
        } catch (error) {
          if (error instanceof ApolloError) {
            return {
              state: 'error',
              message: error?.message,
              fields: this.getFormFields(parsedInput.data),
            }
          }

          return {
            state: 'error',
            message: FormMessage.error.unknown,
            fields: this.getFormFields(parsedInput.data),
          }
        }

        return {
          state: 'success',
          message: FormMessage.success,
          fields: this.getFormFields(parsedInput.data),
        }
      }

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
