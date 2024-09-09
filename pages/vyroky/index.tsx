import TitleIcon from '@/assets/icons/statements.svg'
import client from '@/libs/apollo-client'
import StatementItem from '@/components/statement/Item'
import { useCallback } from 'react'
import { TagFilter } from '@/components/filtering/TagFilter'
import { NextPageContext } from 'next'
import { VeracityFilter } from '@/components/filtering/VeracityFilter'
import { parsePage } from '@/libs/pagination'
import { FilterSection } from '@/components/filtering/FilterSection'
import { ReleasedYearFilter } from '@/components/filtering/ReleasedYearFilter'
import { FilterForm } from '@/components/filtering/FilterForm'
import {
  getNumericalArrayParams,
  getStringArrayParams,
  getStringParam,
} from '@/libs/query-params'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { StatementsListingQueryQuery } from '@/__generated__/graphql'
import { StatementCount } from '@/components/filtering/StatementCount'

const PAGE_SIZE = 10

interface StatementsProps {
  page: number
  data: StatementsListingQueryQuery
  term: string
  selectedTags: number[]
  selectedYears: number[]
  selectedVeracities: string[]
}

export async function getServerSideProps({ query }: NextPageContext) {
  const term = getStringParam(query?.q)
  const selectedTags = getNumericalArrayParams(query?.tags)
  const selectedYears = getNumericalArrayParams(query?.years)
  const selectedVeracities = getStringArrayParams(query?.veracities)
  const page = parsePage(query?.page)

  const { data } = await client.query({
    query: gql(`
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
          filters: $filters
          includeAggregations: true
        ) {
          statements {
            id
            ...StatementDetail
          }
          ...TagFilters
          ...VeracityFilters
          ...ReleasedYearFilters
          totalCount
        }
      }
    `),
    variables: {
      offset: (page - 1) * PAGE_SIZE,
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
      data,
      term,
      selectedTags,
      selectedVeracities,
      selectedYears,
      page,
    },
  }
}

const TagFiltersFragment = gql(`
  fragment TagFilters on SearchResultStatement {
    tags {
      tag {
        id
      }
      ...TagFilter
    }
  }
`)

export function TagFilters(props: {
  data: FragmentType<typeof TagFiltersFragment>
}) {
  const data = useFragment(TagFiltersFragment, props.data)

  return (
    <FilterSection name="Témata" defaultOpen>
      {data.tags?.map((tagAggregate) => (
        <TagFilter
          key={tagAggregate.tag.id}
          tag={tagAggregate}
          renderLabel={StatementCount}
        />
      ))}
    </FilterSection>
  )
}

const VeracityFiltersFragment = gql(`
  fragment VeracityFilters on SearchResultStatement {
    veracities {
      veracity {
        id
      }
      ...VeracityFilter
    }
  }
`)

export function VeracityFilters(props: {
  data: FragmentType<typeof VeracityFiltersFragment>
}) {
  const data = useFragment(VeracityFiltersFragment, props.data)

  return (
    <FilterSection name="Hodnocení">
      {data.veracities?.map((veracityAggregate) => (
        <VeracityFilter
          key={veracityAggregate.veracity.id}
          veracity={veracityAggregate}
        />
      ))}
    </FilterSection>
  )
}

const ReleasedYearFiltersFragment = gql(`
  fragment ReleasedYearFilters on SearchResultStatement {
    years {
      year
      ...ReleasedYearFilter
    }
  }
`)

export function ReleasedYearFilters(props: {
  data: FragmentType<typeof ReleasedYearFiltersFragment>
}) {
  const data = useFragment(ReleasedYearFiltersFragment, props.data)

  return (
    <FilterSection name="Roky">
      {data.years?.map((yearAggregate) => (
        <ReleasedYearFilter key={yearAggregate.year} year={yearAggregate} />
      ))}
    </FilterSection>
  )
}

export default function Statements(props: StatementsProps) {
  const hasAnyFilters =
    [...props.selectedVeracities, ...props.selectedYears, ...props.selectedTags]
      .length > 0

  const { searchStatements } = props.data

  const renderFilters = useCallback(
    () => (
      <>
        <TagFilters data={searchStatements} />

        <VeracityFilters data={searchStatements} />

        <ReleasedYearFilters data={searchStatements} />
      </>
    ),
    [searchStatements]
  )

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
        <FilterForm
          hasAnyFilters={hasAnyFilters}
          term={props.term}
          pageSize={PAGE_SIZE}
          page={props.page}
          totalCount={searchStatements.totalCount}
          renderFilters={renderFilters}
          searchPlaceholder="Zadejte hledaný výrok"
        >
          {searchStatements.statements.map((statement) => (
            <StatementItem key={statement.id} statement={statement} />
          ))}
        </FilterForm>
      </div>
    </div>
  )
}
