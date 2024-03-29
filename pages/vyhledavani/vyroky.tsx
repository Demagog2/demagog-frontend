import React from 'react'
import {
  SearchResultSpeaker,
  SearchResultSpeakerFragment,
} from '@/components/SearchResultSpeaker'
import client from '@/libs/apollo-client'
import gql from 'graphql-tag'
import Link from 'next/link'
import { Pagination } from '@/components/pagination'
import { NextPageContext } from 'next'
import StatementItem, {
  StatementItemFragment,
} from '@/components/statement/Item'
import { parsePage } from '@/libs/pagination'
import { SearchButton } from '@/components/search/SearchButton'

const SEARCH_PAGE_SIZE = 10

export async function getServerSideProps({ query }: NextPageContext) {
  const term = query?.q ?? ''
  const page = parsePage(query?.page)

  const { data } = await client.query({
    query: gql`
      query searchStatements($term: String!, $limit: Int, $offset: Int) {
        searchStatements(term: $term, limit: $limit, offset: $offset) {
          statements {
            ...StatementDetail
          }
          totalCount
        }
      }
      ${StatementItemFragment}
    `,
    variables: {
      term,
      limit: SEARCH_PAGE_SIZE,
      offset: (page - 1) * SEARCH_PAGE_SIZE,
    },
  })

  return {
    props: {
      term,
      page,
      statementSearchResult: data,
    },
  }
}

export default function SearchSpeakers(props: {
  term: string
  page: number
  statementSearchResult: {
    statements: any[]
    totalCount: number
  }
}) {
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
              defaultValue={props.term}
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
                href={`/vyhledavani?q=${props.term}`}
                className="btn h-50px fs-6 s-back-link"
              >
                <span className="me-2">←</span>

                <span>Zpět na souhrn výsledků hledání</span>
              </Link>
            </div>
          </div>
          <div className="row row-cols-1 g-5 g-lg-10">
            {props.statementSearchResult.statements.map((statement) => (
              <StatementItem key={statement.id} statement={statement} />
            ))}
          </div>
          <div className="d-flex justify-content-center my-5 my-lg-10">
            <Pagination
              currentPage={props.page}
              pageSize={SEARCH_PAGE_SIZE}
              totalCount={props.statementSearchResult.totalCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
