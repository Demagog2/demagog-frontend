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
import classNames from 'classnames'
import {
  VeracityAggregation,
  VeracityFilter,
  VeracityFilterFragment,
} from '@/components/statement/filtering/VeracityFilter'
import { parsePage } from '@/libs/pagination'
import { FilterSection } from '@/components/statement/filtering/FilterSection'
import { ResetFilters } from '@/components/statement/filtering/ResetFilters'
import {
  ReleasedYearAggregation,
  ReleasedYearFilter,
} from '@/components/statement/filtering/ReleasedYearFilter'

const PAGE_SIZE = 10

interface StatementsProps {
  page: number
  statements: any
  tags: TagAggregation[]
  years: ReleasedYearAggregation[]
  veracities: VeracityAggregation[]
  term: string
  totalCount: number
  selectedTags: number[]
  selectedYears: number[]
  selectedVeracities: string[]
}

function getNumericalArrayParams(queryTags?: string | string[]): number[] {
  if (!queryTags) {
    return []
  }

  return (Array.isArray(queryTags) ? queryTags : [queryTags]).map((tagId) =>
    parseInt(tagId, 10)
  )
}

function getSelectedVeracities(queryVeracities?: string | string[]): string[] {
  if (!queryVeracities) {
    return []
  }

  return Array.isArray(queryVeracities) ? queryVeracities : [queryVeracities]
}

export async function getServerSideProps({ query }: NextPageContext) {
  const term = query?.q ?? ''
  const selectedTags = getNumericalArrayParams(query?.tags)
  const selectedYears = getNumericalArrayParams(query?.years)
  const selectedVeracities = getSelectedVeracities(query?.veracities)
  const page = parsePage(query?.page)

  const { data } = await client.query({
    query: gql`
      query StatementsListingQuery(
        $term: String!
        $limit: Int
        $offset: Int
        $filters: StatementFilterInput
      ) {
        searchStatements(
          term: $term
          limit: $limit
          offset: $offset
          includeAggregations: true
          filters: $filters
        ) {
          statements {
            ...StatementDetail
          }
          tags {
            ...TagFilter
          }
          veracities {
            ...VeracityFilter
          }
          years {
            year
            count
          }
          totalCount
        }
      }
      ${StatementItemFragment}
      ${TagFilterFragment}
      ${VeracityFilterFragment}
    `,
    variables: {
      offset: 0,
      limit: PAGE_SIZE,
      term,
      filters: {
        tags: selectedTags,
        veracities: selectedVeracities,
        years: selectedYears,
      },
    },
  })

  return {
    props: {
      tags: data.searchStatements.tags,
      years: data.searchStatements.years,
      statements: data.searchStatements.statements,
      veracities: data.searchStatements.veracities,
      totalCount: data.searchStatements.totalCount,
      term,
      selectedTags,
      selectedVeracities,
      selectedYears,
      page,
    },
  }
}

function TagFilters(props: { tags: TagAggregation[]; selectedTags: number[] }) {
  return (
    <FilterSection name="Témata" defaultOpen>
      {props.tags.map(({ tag, count }) => (
        <TagFilter
          key={tag.id}
          tag={tag}
          count={count}
          defaultChecked={props.selectedTags.includes(parseInt(tag.id, 10))}
        />
      ))}
    </FilterSection>
  )
}

function VeracityFilters(props: {
  veracities: VeracityAggregation[]
  selectedVeracities: string[]
}) {
  return (
    <FilterSection name="Hodnocení">
      {props.veracities.map(({ veracity, count }) => (
        <VeracityFilter
          key={veracity.id}
          veracity={veracity}
          count={count}
          isSelected={props.selectedVeracities.includes(veracity.key)}
        />
      ))}
    </FilterSection>
  )
}

function ReleasedYearFilters(props: {
  years: { year: number; count: number }[]
  selectedYears: number[]
}) {
  return (
    <FilterSection name="Roky">
      {props.years.map(({ year, count }) => (
        <ReleasedYearFilter
          key={year}
          year={year}
          count={count}
          isSelected={props.selectedYears.includes(year)}
        />
      ))}
    </FilterSection>
  )
}

const Statements: React.FC<StatementsProps> = ({
  page,
  term,
  statements,
  tags,
  years,
  veracities,
  totalCount,
  selectedTags,
  selectedYears,
  selectedVeracities,
}) => {
  const hasAnyFilters =
    [...selectedVeracities, ...selectedYears, ...selectedVeracities].length > 0

  const [areFiltersOpen, setFiltersOpen] = useState(hasAnyFilters)

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
        <form>
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
                  <div className="w-100 position-relative">
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
                  </div>
                </div>
              </div>
            </div>

            {areFiltersOpen && (
              <div className="col col-12 col-lg-4">
                <div className="bg-light rounded-l p-5">
                  <TagFilters tags={tags} selectedTags={selectedTags} />

                  <VeracityFilters
                    veracities={veracities}
                    selectedVeracities={selectedVeracities}
                  />

                  <ReleasedYearFilters
                    years={years}
                    selectedYears={selectedYears}
                  />

                  <ResetFilters onClick={() => setFiltersOpen(false)} />
                </div>
              </div>
            )}

            <div
              className={classNames('col col-12 ', {
                'col-lg-8': areFiltersOpen,
              })}
            >
              {statements.map((statement: any) => (
                <StatementItem key={statement.id} statement={statement} />
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-center my-5 my-lg-10">
            <Pagination
              pageSize={PAGE_SIZE}
              currentPage={page}
              totalCount={totalCount}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Statements
