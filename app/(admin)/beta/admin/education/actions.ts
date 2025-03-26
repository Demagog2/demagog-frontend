'use server'

import { gql } from '@/__generated__'
import { quizSchema } from '@/libs/education/quiz-schema'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import {
  CreateQuizQuestionMutation,
  CreateQuizQuestionMutationVariables,
  UpdateQuizQuestionMutation,
  UpdateQuizQuestionMutationVariables,
} from '@/__generated__/graphql'

const adminCreateQuizQuestionMutation = gql(`
  mutation CreateQuizQuestion($input: CreateQuizQuestionInput!) {
    createQuizQuestion(input: $input) {
      quizQuestion {
        id
      }
      errors
    }
  }
`)

export const createQuizQuestion = new CreateActionBuilder<
  typeof quizSchema,
  CreateQuizQuestionMutation,
  CreateQuizQuestionMutationVariables,
  typeof adminCreateQuizQuestionMutation
>(quizSchema)
  .withMutation(adminCreateQuizQuestionMutation, (data) => {
    const { quizAnswers, ...rest } = data

    return {
      input: {
        ...rest,
        quizAnswers: quizAnswers.map((answer) => ({
          text: answer.text,
          isCorrect: answer.isCorrect,
        })),
      },
    }
  })
  .withRedirectUrl((data) => {
    if (data?.createQuizQuestion?.quizQuestion) {
      return `/beta/admin/education`
    }

    if (data?.createQuizQuestion?.errors?.length) {
      console.log(data.createQuizQuestion.errors)
      return null
    }

    return null
  })
  .build()

const adminUpdateQuizQuestionMutation = gql(`
    mutation UpdateQuizQuestion($input: UpdateQuizQuestionInput!) {
      updateQuizQuestion(input: $input) {
        quizQuestion {
          id
        }
      }
    }
  `)

export const updateQuizQuestion = new UpdateActionBuilder<
  typeof quizSchema,
  UpdateQuizQuestionMutation,
  UpdateQuizQuestionMutationVariables,
  typeof adminUpdateQuizQuestionMutation
>(quizSchema)
  .withMutation(adminUpdateQuizQuestionMutation, (id, data) => {
    const { quizAnswers, ...rest } = data

    return {
      input: {
        id,
        ...rest,
        quizAnswers: quizAnswers.map((answer) => ({
          text: answer.text,
          isCorrect: answer.isCorrect,
        })),
      },
    }
  })
  .build()
