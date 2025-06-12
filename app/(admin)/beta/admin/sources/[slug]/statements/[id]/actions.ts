'use server'

import { gql } from '@/__generated__'
import { ActivityFilterInput } from '@/__generated__/graphql'
import { serverQuery } from '@/libs/apollo-client-server'

export async function getActivityCount(
  statementId: string,
  filter: ActivityFilterInput
): Promise<number> {
  const { data } = await serverQuery({
    query: gql(`
      query AdminNewActivitiesData ($id: Int!, $filter: ActivityFilterInput) {
        statementV2(id: $id, includeUnpublished: true) {
          activitiesCount(filter: $filter)
        }
      }
  `),
    variables: {
      id: parseInt(statementId, 10),
      filter,
    },
  })

  return data?.statementV2?.activitiesCount ?? 0
}
