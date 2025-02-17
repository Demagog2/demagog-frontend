'use server'

import { gql } from '@/__generated__'
import { sourceSchema } from '@/libs/sources/source-schema'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'
import {
  CreateSourceMutation,
  CreateSourceMutationVariables,
  UpdateSourceMutation,
  UpdateSourceMutationVariables,
  CreateStatementMutation,
  CreateStatementMutationVariables,
  StatementType,
  UpdateStatementMutation,
  UpdateStatementMutationVariables,
} from '@/__generated__/graphql'
import { assessmentSchema } from '@/libs/sources/assessment-schema'
import { statementSchema } from '@/libs/sources/statement-schema'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'

const adminCreateSourceMutation = gql(`
  mutation CreateSource($sourceInput: SourceInput!) {
    createSource(sourceInput: $sourceInput) {
      source {
        id
      }
    }
  }
`)

export const createSource = new CreateActionBuilder<
  typeof sourceSchema,
  CreateSourceMutation,
  CreateSourceMutationVariables,
  typeof adminCreateSourceMutation
>(sourceSchema)
  .withMutation(adminCreateSourceMutation, (data) => ({
    sourceInput: {
      ...data,
    },
  }))
  .withRedirectUrl((data) => {
    if (data?.createSource?.source) {
      return `/beta/admin/sources/${data?.createSource?.source.id}`
    }

    return null
  })
  .build()

const adminCreateStatementMutation = gql(`
  mutation CreateStatement($statementInput: CreateStatementInput!) {
    createStatement(statementInput: $statementInput) {
      statement {
        id
        source {
          id
        }
      }
    }
  }
`)

export const createStatement = new CreateActionBuilder<
  typeof statementSchema,
  CreateStatementMutation,
  CreateStatementMutationVariables,
  typeof adminCreateStatementMutation
>(statementSchema)
  .withMutation(adminCreateStatementMutation, (data) => ({
    statementInput: {
      content: data.content,
      sourceSpeakerId: data.sourceSpeakerId,
      assessment: {
        evaluatorId: data.evaluatorId,
      },
      sourceId: data.sourceId,
      statementType: data.statementType as StatementType,

      excerptedAt: new Date().toISOString(),
      important: false,
      published: false,
    },
  }))
  .withRedirectUrl((data) => {
    if (data?.createStatement?.statement.source?.id) {
      return `/beta/admin/sources/${data.createStatement.statement.source.id}`
    }

    return null
  })
  .build()

const adminUpdateSourceMutation = gql(`
  mutation UpdateSource($id: ID!, $sourceInput: SourceInput!) {
    updateSource(id: $id, sourceInput: $sourceInput) {
      source {
        id
      }
    }
  }
`)

export const updateSource = new UpdateActionBuilder<
  typeof sourceSchema,
  UpdateSourceMutation,
  UpdateSourceMutationVariables,
  typeof adminUpdateSourceMutation
>(sourceSchema)
  .withMutation(adminUpdateSourceMutation, (id, input) => ({
    id,
    sourceInput: {
      ...input,
      sourceSpeakers:
        input.sourceSpeakers?.map(({ sourceSpeakerId, ...sourceSpeaker }) => ({
          id: sourceSpeakerId,
          ...sourceSpeaker,
        })) ?? [],
      mediaPersonalities: input.mediaPersonalities ?? [],
      experts: input.experts ?? [],
    },
  }))
  .build()

const adminUpdateStatementMutation = gql(`
  mutation UpdateStatement($id: Int!, $statementInput: UpdateStatementInput!) {
    updateStatement(id: $id, statementInput: $statementInput) {
      statement {
        id
      }
    }
  }
`)

export const updateStatementAssessment = new UpdateActionBuilder<
  typeof assessmentSchema,
  UpdateStatementMutation,
  UpdateStatementMutationVariables,
  typeof adminUpdateStatementMutation
>(assessmentSchema)
  .withMutation(adminUpdateStatementMutation, (id, input) => {
    const {
      statementType,
      promiseRatingId,
      veracityId,
      shortExplanation,
      explanation,
      evaluatorId,
      evaluationStatus,
      published = false,
      ...rest
    } = input

    return {
      id: parseInt(id, 10),
      statementInput:
        statementType === 'promise'
          ? {
              ...rest,
              published,
              assessment: {
                promiseRatingId,
                explanationHtml: explanation,
                shortExplanation,
                evaluatorId: evaluatorId === '' ? null : evaluatorId,
                evaluationStatus,
              },
            }
          : {
              ...rest,
              published,
              assessment: {
                veracityId,
                explanationHtml: explanation,
                shortExplanation,
                evaluatorId: evaluatorId === '' ? null : evaluatorId,
                evaluationStatus,
              },
            },
    }
  })
  .build()

const adminDeleteStatementMutation = gql(`
  mutation AdminDeleteStatement($id: ID!) {
    deleteStatement(id: $id) {
      id
    }
  }
`)

export async function deleteStatement(sourceId: string, statementId: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteStatementMutation,
    variables: {
      id: statementId,
    },
  })

  if (data?.deleteStatement?.id) {
    redirect(`/beta/admin/sources/${sourceId}`)
  }
}

const adminDeleteSourceMutation = gql(`
  mutation AdminDeleteSource($id: ID!) {
    deleteSource(id: $id) {
      id
    }
  }
`)

export async function deleteSource(sourceId: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteSourceMutation,
    variables: {
      id: sourceId,
    },
  })

  if (data?.deleteSource?.id) {
    redirect(`/beta/admin/sources`)
  }
}
