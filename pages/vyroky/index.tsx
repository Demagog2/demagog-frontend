import TitleIcon from '@/assets/icons/statements.svg'
import client from '@/libs/apollo-client'
import StatementItem, {
  StatementItemFragment,
} from '@/components/statement/Item'
import gql from 'graphql-tag'
import { useState } from 'react'
import {
  TagAggregation,
  TagFilter,
  TagFilterFragment,
} from '@/components/statement/filtering/TagFilter'
import { NextPageContext } from 'next'
import { Pagination } from '@/components/pagination'

const PAGE_SIZE = 10

interface StatementsProps {
  statements: any
  tags: TagAggregation[]
  term: string
  totalCount: number
}

export async function getServerSideProps({ query }: NextPageContext) {
  const term = query?.q ?? ''

  const { data } = await client.query({
    query: gql`
      query StatementsListingQuery($term: String!, $limit: Int, $offset: Int) {
        searchStatements(
          term: $term
          limit: $limit
          offset: $offset
          includeAggregations: true
        ) {
          statements {
            ...StatementDetail
          }
          tags {
            ...TagFilter
          }
          totalCount
        }
      }
      ${StatementItemFragment}
      ${TagFilterFragment}
    `,
    variables: {
      offset: 0,
      limit: PAGE_SIZE,
      term,
    },
  })

  return {
    props: {
      tags: data.searchStatements.tags,
      statements: data.searchStatements.statements,
      totalCount: data.searchStatements.totalCount,
      term,
    },
  }
}

const Statements: React.FC<StatementsProps> = ({
  term,
  statements,
  tags,
  totalCount,
}) => {
  const [areFiltersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="container">
      <div className="row g-10">
        <div className="col col-12">
          <div className="d-flex align-items-center">
            <div className="me-2">
              <TitleIcon className="h-35px" />
            </div>
            <h1 className="display-4 fw-bold m-0 p-0">
              Přehled ověřených výroků
            </h1>
          </div>
        </div>

        <div className="row g-10 mt-10">
          <div className="col col-12 col-lg-4">
            <a
              className="btn w-100 h-44px"
              onClick={() => setFiltersOpen(!areFiltersOpen)}
            >
              <span className="text-white">
                {areFiltersOpen ? 'Skrýt filtry' : 'Zobrazit filtry'}
              </span>
            </a>
          </div>
          <div className="col col-12 col-lg-8">
            <div className="d-flex justify-content-end">
              <div className="w-100 mw-350px">
                <form className="w-100 position-relative">
                  <input
                    name="q"
                    type="text"
                    defaultValue={term}
                    className="input outline focus-primary search"
                    placeholder="Zadejte hledaný výrok"
                  />
                  <button
                    type="submit"
                    className="search-btn d-flex align-items-center justify-content-center right top w-50px"
                  >
                    <svg
                      height="17"
                      viewBox="0 0 17 17"
                      width="17"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m1181.34341 104.52344-4.0019-4.018708c1.69829-2.5558307 1.36199-5.9523952-.8071-8.1214883-1.22747-1.2106567-2.84168-1.8832437-4.57359-1.8832437s-3.34612.672587-4.55678 1.8832437c-2.50539 2.5222013-2.50539 6.6081675 0 9.1135543 2.16909 2.169093 5.56566 2.505387 8.12149.823919l4.01871 4.018707c.18496.184962.50444.184962.6894 0l1.10977-1.109768c.20177-.201776.20177-.521255 0-.706216zm-6.28869-4.489519c-1.69828 1.698282-4.47271 1.698282-6.1878 0-1.69829-1.6982821-1.69829-4.4727036 0-6.1878005 1.69828-1.6982823 4.4727-1.6982823 6.1878 0 1.69828 1.7150969 1.69828 4.4895184 0 6.1878005z"
                        fill="#3c325c"
                        transform="translate(-1165 -90)"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {areFiltersOpen && (
            <div className="col col-12 col-lg-4">
              <div className="bg-light rounded-l p-5">
                <div className="filter w-100 mb-5">
                  <div className="filter-link d-flex align-items-center justify-content-between w-100 min-h-40px">
                    <span className="fs-6 fw-600">Témata</span>
                    <span className="filter-icon">
                      <svg
                        width="23"
                        height="12"
                        viewBox="0 0 23 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 0.597656L11.646 11.2437L22.2435 0.646237"
                          stroke="#111827"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="filter-content">
                    {tags.map(({ tag, count }) => (
                      <TagFilter key={tag.id} tag={tag} count={count} />
                    ))}
                  </div>

                  <div className="w-100 mt-5">
                    <a
                      className="btn w-100"
                      onClick={() => setFiltersOpen(false)}
                    >
                      <span className="text-white">Zrušit filtry</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={areFiltersOpen ? 'col col-12 col-lg-8' : 'col col-12'}
          >
            <div>
              {statements.map((statement: any) => (
                <StatementItem key={statement.id} statement={statement} />
              ))}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center my-5 my-lg-10">
          <Pagination
            pageSize={PAGE_SIZE}
            currentPage={1}
            totalCount={totalCount}
          />
        </div>
      </div>
    </div>
  )
}

export default Statements
