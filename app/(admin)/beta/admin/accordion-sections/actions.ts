'use server'

import { gql } from '@/__generated__'
import { serverMutation } from '@/libs/apollo-client-server'
import { redirect } from 'next/navigation'

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
