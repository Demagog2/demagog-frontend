import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { notFound } from 'next/navigation'
import { HomepageFirstPage } from '@/components/homepage/HomepageFirstPage'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { query } from '@/libs/apollo-client'
import { buildGraphQLVariables } from '@/libs/pagination'

export const metadata: Metadata = {
  title: getMetadataTitle('Ověřujeme pro Vás'),
  ...getRobotsMetadata(),
  ...getCanonicalMetadata('/'),
}

export default async function Homepage() {
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
        }
        ...MostSearchedSpeakers
      }
    `),
    variables: { ...buildGraphQLVariables({ pageSize: 6 }) },
  })

  if (!data.homepageArticlesV3 || data.homepageArticlesV3.nodes?.length === 0) {
    notFound()
  }

  return (
    <>
      <HomepageFirstPage data={data} />
    </>
  )
}
