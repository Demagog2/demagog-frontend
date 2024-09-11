import React from 'react'
import { SearchResultSpeaker } from '@/components/SearchResultSpeaker'
import client from '@/libs/apollo-client'
import Link from 'next/link'
import { Pagination } from '@/components/pagination'
import { parsePage } from '@/libs/pagination'
import { SearchButton } from '@/components/search/SearchButton'
import { gql } from '@/__generated__'
import { getStringParam } from '@/libs/query-params'
import { PropsWithSearchParams } from '@/libs/params'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'

const SEARCH_PAGE_SIZE = 12

export async function generateMetadata(
  props: PropsWithSearchParams
): Promise<Metadata> {
  return {
    title: getMetadataTitle(
      props.searchParams.q
        ? `Vyhledávání politiků a političek: ${props.searchParams.q}`
        : 'Vyhledávání politiků a političek'
    ),
    description: 'Hledejte v databázi politiků a političek',
  }
}

export default async function SearchSpeakers(props: PropsWithSearchParams) {
  const term = getStringParam(props.searchParams.q)
  const page = parsePage(props.searchParams.page)

  const { data } = await client.query({
    query: gql(`
      query searchSpeakers($term: String!, $limit: Int, $offset: Int) {
        searchSpeakers(term: $term, limit: $limit, offset: $offset) {
          speakers {
            id
            ...SearchResultSpeakerDetail
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
              <h2 className="display-5 fw-bold">Nalezené výsledky</h2>
            </div>
            <div className="my-5">
              <Link
                href={`/vyhledavani?q=${term}`}
                className="btn h-50px fs-6 s-back-link"
              >
                <span className="me-2">←</span>

                <span>Zpět na souhrn výsledků hledání</span>
              </Link>
            </div>
          </div>
          <div className="row row-cols-2 row-cols-lg-6 g-5 g-lg-10">
            {data.searchSpeakers.speakers.map((speaker) => (
              <SearchResultSpeaker key={speaker.id} speaker={speaker} />
            ))}
          </div>
          <div className="d-flex justify-content-center my-5 my-lg-10">
            <Pagination
              currentPage={page}
              pageSize={SEARCH_PAGE_SIZE}
              totalCount={data.searchSpeakers.totalCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
