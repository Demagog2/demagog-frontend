'use server'

import { gql } from '@/__generated__'
import { schema } from '@/libs/accordion-section/schema'
import { serverMutation } from '@/libs/apollo-client-server'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { redirect } from 'next/navigation'
import {
  CreateAccordionSectionMutation,
  CreateAccordionSectionMutationVariables,
} from '@/__generated__/graphql'

const adminDeleteAccordionSectionMutation = gql(`
  mutation AdminDeleteAccordionSection($input: DeleteAccordionSectionMutationInput!) {
    deleteAccordionSection(input: $input) {
      ... on DeleteAccordionSectionSuccess {
        id
      }
      ... on DeleteAccordionSectionError {
        message
      }
    }
  }
`)

export async function deleteAccordionSection(accordionSectionId: string) {
  const { data } = await serverMutation({
    mutation: adminDeleteAccordionSectionMutation,
    variables: {
      input: {
        id: accordionSectionId,
      },
    },
  })

  if (
    data?.deleteAccordionSection?.__typename === 'DeleteAccordionSectionSuccess'
  ) {
    redirect(`/beta/admin/accordion-sections`)
  }
}

const adminCreateAccordionSectionMutation = gql(`
  mutation CreateAccordionSection($input: CreateAccordionSectionMutationInput!) {
    createAccordionSection(input: $input) {
      ... on CreateAccordionSectionSuccess {
        accordionSection {
          id
        }
      }
      ... on CreateAccordionSectionError {
        message
      }
    }
  }
`)

export const createAccordionSection = new CreateActionBuilder<
  typeof schema,
  CreateAccordionSectionMutation,
  CreateAccordionSectionMutationVariables,
  typeof adminCreateAccordionSectionMutation
>(schema)
  .withMutation(adminCreateAccordionSectionMutation, (data) => ({
    input: {
      ...data,
      order: data.order ? Number(data.order) : undefined,
    },
  }))
  .withRedirectUrl((data) => {
    if (
      data.createAccordionSection?.__typename ===
      'CreateAccordionSectionSuccess'
    ) {
      return `/beta/admin/accordion-sections/${data.createAccordionSection.accordionSection.id}`
    }

    return null
  })
  .build()
