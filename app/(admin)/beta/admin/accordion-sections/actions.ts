'use server'

import { gql } from '@/__generated__'
import {
  accordionItemSchema,
  accordionSectionSchema,
} from '@/libs/accordion-section/schema'
import { serverMutation } from '@/libs/apollo-client-server'
import { CreateActionBuilder } from '@/libs/forms/builders/CreateActionBuilder'
import { redirect } from 'next/navigation'
import {
  CreateAccordionSectionMutation,
  CreateAccordionSectionMutationVariables,
  UpdateAccordionSectionMutation,
  UpdateAccordionSectionMutationVariables,
  UpdateAccordionItemMutation,
  UpdateAccordionItemMutationVariables,
  CreateAccordionItemMutation,
  CreateAccordionItemMutationVariables,
} from '@/__generated__/graphql'
import { UpdateActionBuilder } from '@/libs/forms/builders/UpdateActionBuilder'

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
  typeof accordionSectionSchema,
  CreateAccordionSectionMutation,
  CreateAccordionSectionMutationVariables,
  typeof adminCreateAccordionSectionMutation
>(accordionSectionSchema)
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

const adminUpdateAccordionSectionMutation = gql(`
    mutation UpdateAccordionSection($input: UpdateAccordionSectionMutationInput!) {
      updateAccordionSection(input: $input) {
        ... on UpdateAccordionSectionSuccess {
          accordionSection {
            id
          }
        }
        ... on UpdateAccordionSectionError {
          message
        }
      }
    }
  `)

export const updateAccordionSection = new UpdateActionBuilder<
  typeof accordionSectionSchema,
  UpdateAccordionSectionMutation,
  UpdateAccordionSectionMutationVariables,
  typeof adminUpdateAccordionSectionMutation
>(accordionSectionSchema)
  .withMutation(adminUpdateAccordionSectionMutation, (id, data) => ({
    input: {
      id,
      ...data,
    },
  }))
  .build()

const adminCreateAccordionItemMutation = gql(`
    mutation CreateAccordionItem($input: CreateAccordionItemMutationInput!) {
      createAccordionItem(input: $input) {
        ... on CreateAccordionItemSuccess {
          accordionItem {
            id
          }
        }
        ... on CreateAccordionItemError {
          message
        }
      }
    }
  `)

export const createAccordionItem = new CreateActionBuilder<
  typeof accordionItemSchema,
  CreateAccordionItemMutation,
  CreateAccordionItemMutationVariables,
  typeof adminCreateAccordionItemMutation
>(accordionItemSchema)
  .withMutation(adminCreateAccordionItemMutation, (data) => ({
    input: {
      ...data,
      order: data.order ? Number(data.order) : undefined,
      memberListing: data.memberListing
        ? Number(data.memberListing)
        : undefined,
    },
  }))
  .withRedirectUrl((data) => {
    if (data.createAccordionItem?.__typename === 'CreateAccordionItemSuccess') {
      return `/beta/admin/accordion-sections/${data.createAccordionItem.accordionItem.id}`
    }

    return null
  })
  .build()

const adminUpdateAccordionItemMutation = gql(`
  mutation UpdateAccordionItem($input: UpdateAccordionItemMutationInput!) {
    updateAccordionItem(input: $input) {
      ... on UpdateAccordionItemSuccess {
        accordionItem {
          id
        }
      }
      ... on UpdateAccordionItemError {
        message
      }
    } 
  }
`)

export const updateAccordionItem = new UpdateActionBuilder<
  typeof accordionItemSchema,
  UpdateAccordionItemMutation,
  UpdateAccordionItemMutationVariables,
  typeof adminUpdateAccordionItemMutation
>(accordionItemSchema)
  .withMutation(adminUpdateAccordionItemMutation, (id, data) => ({
    input: {
      id,
      ...data,
    },
  }))
  .build()
