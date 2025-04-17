import { gql } from '@/__generated__'
import { query } from '@/libs/apollo-client'
import { ArticleV2Preview } from '@/components/article/ArticleV2Preview'
import { PropsWithSearchParams } from '@/libs/params'
import { fromPageToCursor, parsePage } from '@/libs/pagination'
import { Metadata } from 'next'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { notFound } from 'next/navigation'
import { NumericalPagination } from '@/components/article/NumericalPagination'

export async function generateMetadata({
  searchParams,
}: PropsWithSearchParams): Promise<Metadata> {
  const page = parsePage(searchParams.page)
  return {
    title: getMetadataTitle(
      page === 1
        ? 'Přehled všech diskuzí'
        : `Přehled všech diskuzí - Strana ${page}`
    ),
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(page === 1 ? '/diskuze' : `/diskuze?page=${page}`),
  }
}

export default async function Articles(props: PropsWithSearchParams) {
  const page = parsePage(props.searchParams.page)

  const { data } = await query({
    query: gql(`
      query articlesData($first: Int, $last: Int, $after: String, $before: String) {
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
    <div className="container">
      <div className="row g-5 g-lg-10 flex-lg-row-reverse">
        <div className="col col-12">
          <div className="row row-cols-1 row-cols-lg-2 g-10">
            {data.homepageArticlesV3.nodes?.flatMap((article) => {
              if (!article) {
                return null
              }

              return [<ArticleV2Preview article={article} key={article?.id} />]
            })}

            <NumericalPagination
              pageInfo={data.homepageArticlesV3.pageInfo}
              page={page}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
