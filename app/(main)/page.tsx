import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { notFound } from 'next/navigation'
import { HomepageFirstPage } from '@/components/homepage/HomepageFirstPage'
import { HomepageNextPage } from '@/components/homepage/HomepageNextPage'
import { PropsWithSearchParams } from '@/libs/params'
import {
  getCanonicalMetadata,
  getCanonicalRelativeUrl,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { getStringParam } from '@/libs/query-params'
import { query } from '@/libs/apollo-client'
import { buildGraphQLVariables } from '@/libs/pagination'

export async function generateMetadata(
  props: PropsWithSearchParams
): Promise<Metadata> {
  const after = getStringParam(props.searchParams.after)
  const before = getStringParam(props.searchParams.before)

  const {
    data: {
      homepageArticlesV3: { pageInfo },
    },
  } = await query({
    query: gql(`
       query homepageMetadata($first: Int, $last: Int, $after: String, $before: String) {
        homepageArticlesV3(first: $first, last: $last, after: $after, before: $before) {
          pageInfo {
            hasPreviousPage
          }
        }
      }
    `),
    variables: { ...buildGraphQLVariables({ before, after, pageSize: 10 }) },
  })

  return {
    title: getMetadataTitle('Ověřujeme pro Vás'),
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(
      getCanonicalRelativeUrl('', pageInfo.hasPreviousPage, after, before)
    ),
  }
}

export default async function Homepage(props: PropsWithSearchParams) {
  const after = getStringParam(props.searchParams.after)
  const before = getStringParam(props.searchParams.before)

  const { data } = await query({
    query: gql(`
      query homepageData($first: Int, $last: Int, $after: String, $before: String) {
        homepageArticlesV3(first: $first, last: $last, after: $after, before: $before) {
          nodes {
            ... on Article {
              id
            }
            ... on SingleStatementArticle {
              id
            }
            ...ArticleV2PreviewFragment
          }
          pageInfo {
            hasPreviousPage
            ...PaginationFragment
          }
        }
        ...MostSearchedSpeakers
      }
    `),
    variables: { ...buildGraphQLVariables({ before, after, pageSize: 10 }) },
  })

  if (!data.homepageArticlesV3) {
    notFound()
  }

  return !data.homepageArticlesV3.pageInfo.hasPreviousPage ? (
    <HomepageFirstPage data={data} />
  ) : (
    <HomepageNextPage data={data} />
  )
}
