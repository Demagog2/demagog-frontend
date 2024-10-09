import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { notFound } from 'next/navigation'
import { HomepageFirstPage } from '@/components/homepage/HomepageFirstPage'
import { HomepageNextPage } from '@/components/homepage/HomepageNextPage'
import { PropsWithSearchParams } from '@/libs/params'
import { getMetadataTitle } from '@/libs/metadata'
import { getStringParam } from '@/libs/query-params'
import { query } from '@/libs/apollo-client'

export const metadata: Metadata = {
  title: getMetadataTitle('Ověřujeme pro Vás'),
}

const PAGE_SIZE = 10

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
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
        ...MostSearchedSpeakers
      }
    `),
    variables: after
      ? { after, first: PAGE_SIZE }
      : before
        ? { before, last: PAGE_SIZE }
        : { first: PAGE_SIZE },
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
