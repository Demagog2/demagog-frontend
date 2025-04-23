import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { notFound, redirect } from 'next/navigation'
import { HomepageFirstPage } from '@/components/homepage/HomepageFirstPage'
import { HomepageNextPage } from '@/components/homepage/HomepageNextPage'
import { PropsWithSearchParams } from '@/libs/params'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { query } from '@/libs/apollo-client'
import { fromPageToCursor, parsePage } from '@/libs/pagination'
import { NumericalPagination } from '@/components/article/NumericalPagination'

export async function generateMetadata(
  props: PropsWithSearchParams
): Promise<Metadata> {
  const page = parsePage(props.searchParams.page)

  if (props.searchParams.page === '1') {
    redirect('')
  }

  return {
    title: getMetadataTitle(
      'Ověřujeme pro Vás' + (page > 1 ? ` - strana ${page}` : '')
    ),
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(page === 1 ? '' : `/?page=${page}`),
  }
}

export default async function Homepage(props: PropsWithSearchParams) {
  const page = parsePage(props.searchParams.page)

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
            ...NumericalPagination
          }
        }
        ...MostSearchedSpeakers
      }
    `),
    variables: fromPageToCursor(page, 10),
  })

  if (!data.homepageArticlesV3 || data.homepageArticlesV3.nodes?.length === 0) {
    notFound()
  }

  return (
    <>
      {!data.homepageArticlesV3.pageInfo.hasPreviousPage ? (
        <HomepageFirstPage data={data} />
      ) : (
        <HomepageNextPage data={data} />
      )}
      <NumericalPagination
        pageInfo={data.homepageArticlesV3.pageInfo}
        page={page}
      />
    </>
  )
}
