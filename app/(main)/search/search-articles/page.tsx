import React from 'react'
import { query } from '@/libs/apollo-client'
import { Pagination } from '@/components/pagination'
import ArticleItem from '@/components/article/Item'
import { parsePage } from '@/libs/pagination'
import { SearchButton } from '@/components/search/SearchButton'
import { gql } from '@/__generated__'
import { getStringParam } from '@/libs/query-params'
import { PropsWithSearchParams } from '@/libs/params'
import { Metadata } from 'next'
import { getMetadataTitle, getRobotsMetadata } from '@/libs/metadata'

const SEARCH_PAGE_SIZE = 10

export async function generateMetadata(
  props: PropsWithSearchParams
): Promise<Metadata> {
  return {
    title: getMetadataTitle(
      props.searchParams.q
        ? `Vyhledávání výstupů: ${props.searchParams.q}`
        : 'Vyhledávání výstupů'
    ),
    description: 'Hledejte mezi výstupy Demagog.cz',
    ...getRobotsMetadata(),
  }
}

export default async function SearchArticles(props: PropsWithSearchParams) {
  const term = getStringParam(props.searchParams.q)
  const page = parsePage(props.searchParams.page)

  const { data } = await query({
    query: gql(`
      query searchArticles($term: String!, $limit: Int, $offset: Int) {
        searchArticles(term: $term, limit: $limit, offset: $offset) {
          articles {
            id
            ...ArticleDetail
          }
          totalCount
        }
      }
    `),
    variables: {
      term,
      limit: SEARCH_PAGE_SIZE,
      offset: (page - 1) * SEARCH_PAGE_SIZE,
    },
  })

  return (
    <div className="container">
      <div className="row g-5 g-lg-10 justify-content-center">
        <div className="col col-12 col-lg-8">
          <form
            className="position-relative"
            action="/vyhledavani"
            acceptCharset="UTF-8"
            method="get"
          >
            <input
              type="text"
              name="q"
              id="q"
              defaultValue={term}
              className="input outline focus-primary fs-4 min-h-50px s-search-field"
              placeholder="Zadejte hledaný výraz…"
            />
            <SearchButton />
          </form>
        </div>
        <div className="col col-12">
          <div className="d-flex align-items-center justify-content-between mb-5 mb-lg-10">
            <div className="my-5">
              <h2 className="display-2 fw-bold">Nalezené výsledky</h2>
            </div>
            <div className="my-5">
              <a
                href={`/vyhledavani?q=${term}`}
                className="btn h-50px fs-6 s-back-link"
              >
                <span className="me-2">←</span>

                <span>Zpět na souhrn výsledků hledání</span>
              </a>
            </div>
          </div>
          <div className="row row-cols-1  row-cols-lg-2 g-5 g-lg-10">
            {data.searchArticles.articles.map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))}
          </div>
          <div className="d-flex justify-content-center my-5 my-lg-10">
            <Pagination
              currentPage={page}
              pageSize={SEARCH_PAGE_SIZE}
              totalCount={data.searchArticles.totalCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
