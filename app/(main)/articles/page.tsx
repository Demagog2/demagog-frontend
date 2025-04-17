import { Pagination } from '@/components/article/Pagination'
import { gql } from '@/__generated__'
import { query } from '@/libs/apollo-client'
import { ArticleV2Preview } from '@/components/article/ArticleV2Preview'
import { PropsWithSearchParams } from '@/libs/params'
import { parsePage } from '@/libs/pagination'
import { Metadata } from 'next'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { getStringParam } from '@/libs/query-params'
import { buildGraphQLVariables } from '@/libs/pagination'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  searchParams,
}: PropsWithSearchParams): Promise<Metadata> {
  const page = parsePage(searchParams.page)
  return {
    title: getMetadataTitle('Přehled všech diskuzí'),
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(page === 1 ? '/diskuze' : `/diskuze?page=${page}`),
  }
}

export default async function Articles(props: PropsWithSearchParams) {
  const after = getStringParam(props.searchParams.after)
  const before = getStringParam(props.searchParams.before)

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

            <Pagination pageInfo={data.homepageArticlesV3.pageInfo} />
          </div>
        </div>
      </div>
    </div>
  )
}
