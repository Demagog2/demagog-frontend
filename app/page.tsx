import client from '../libs/apollo-client'
import { Metadata } from 'next'
import { HomepageDataQuery } from '@/__generated__/graphql'
import { gql } from '@/__generated__'
import { notFound } from 'next/navigation'
import { HomepageFirstPage } from '@/components/homepage/HomepageFirstPage'
import { HomepageNextPage } from '@/components/homepage/HomepageNextPage'
import { QueryParams } from '@/libs/params'

export const metadata: Metadata = {
  title: 'Ověřujeme pro Vás',
}

export default async function Homepage(props: { searchParams: QueryParams }) {
  const after = props.searchParams?.after
  const before = props.searchParams?.before

  const { data } = await client.query<HomepageDataQuery>({
    query: gql(`
      query homepageData($after: String, $before: String) {
        homepageArticlesV3(first: 10, after: $after, before: $before) {
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
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
        ...MostSearchedSpeakers
      }
    `),
    variables: after ? { after } : before ? { before } : {},
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
