import TitleIcon from '@/assets/icons/statements.svg'
import client from '@/libs/apollo-client'
import StatementItem, {
  StatementItemFragment,
} from '@/components/statement/Item'
import gql from 'graphql-tag'
import { useCallback } from 'react'
import {
  TagAggregation,
  TagFilter,
  TagFilterFragment,
} from '@/components/statement/filtering/TagFilter'
import { NextPageContext } from 'next'
import {
  VeracityAggregation,
  VeracityFilter,
  VeracityFilterFragment,
} from '@/components/statement/filtering/VeracityFilter'
import { parsePage } from '@/libs/pagination'
import { FilterSection } from '@/components/statement/filtering/FilterSection'
import {
  ReleasedYearAggregation,
  ReleasedYearFilter,
  ReleasedYearFilterFragment,
} from '@/components/statement/filtering/ReleasedYearFilter'
import {
  EditorPickedAggregation,
  EditorPickedFilter,
  EditorPickedFilterFragment,
} from '@/components/statement/filtering/EditorPickedFilter'
import { FilterForm } from '@/components/statement/filtering/FilterForm'
import { getNumericalArrayParams } from '@/libs/query-params'

const PAGE_SIZE = 10

interface StatementsProps {
  page: number
  statements: any
  tags: TagAggregation[]
  years: ReleasedYearAggregation[]
  veracities: VeracityAggregation[]
  editorPicked: EditorPickedAggregation
  term: string
  totalCount: number
  selectedTags: number[]
  selectedYears: number[]
  selectedVeracities: string[]
  editorPickedSelected: boolean
}

function getSelectedVeracities(queryVeracities?: string | string[]): string[] {
  if (!queryVeracities) {
    return []
  }

  return Array.isArray(queryVeracities) ? queryVeracities : [queryVeracities]
}

function getBooleanParam(param?: string | string[]): boolean {
  if (!param) {
    return false
  }

  return Array.isArray(param) ? false : Boolean(param)
}

export async function getServerSideProps({ query }: NextPageContext) {
  const term = query?.q ?? ''
  const selectedTags = getNumericalArrayParams(query?.tags)
  const selectedYears = getNumericalArrayParams(query?.years)
  const selectedVeracities = getSelectedVeracities(query?.veracities)
  const editorPickedSelected = getBooleanParam(query?.editorPicked)
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
            ...ReleasedYearFilter
          }
          editorPicked {
            ...EditorPickedFilter
          }
          totalCount
        }
      }
      ${StatementItemFragment}
      ${TagFilterFragment}
      ${VeracityFilterFragment}
      ${ReleasedYearFilterFragment}
      ${EditorPickedFilterFragment}
    `,
    variables: {
      offset: 0,
      limit: PAGE_SIZE,
      term,
      filters: {
        tags: selectedTags,
        veracities: selectedVeracities,
        years: selectedYears,
        editorPicked: editorPickedSelected,
      },
    },
  })

  return {
    props: {
      tags: data.searchStatements.tags,
      years: data.searchStatements.years,
      statements: data.searchStatements.statements,
      veracities: data.searchStatements.veracities,
      editorPicked: data.searchStatements.editorPicked,
      totalCount: data.searchStatements.totalCount,
      term,
      selectedTags,
      selectedVeracities,
      selectedYears,
      editorPickedSelected,
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

export default function Statements(props: StatementsProps) {
  const hasAnyFilters =
    [...props.selectedVeracities, ...props.selectedYears, ...props.selectedTags]
      .length > 0

  const renderFilters = useCallback(() => {
    return (
      <>
        <TagFilters tags={props.tags} selectedTags={props.selectedTags} />

        <VeracityFilters
          veracities={props.veracities}
          selectedVeracities={props.selectedVeracities}
        />

        <ReleasedYearFilters
          years={props.years}
          selectedYears={props.selectedYears}
        />

        <EditorPickedFilter
          count={props.editorPicked.count}
          isSelected={props.editorPickedSelected}
        />
      </>
    )
  }, [
    props.editorPicked.count,
    props.editorPickedSelected,
    props.selectedTags,
    props.selectedVeracities,
    props.selectedYears,
    props.tags,
    props.veracities,
    props.years,
  ])

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
          totalCount={props.totalCount}
          renderFilters={renderFilters}
          searchPlaceholder="Zadejte hledaný výrok"
        >
          {props.statements.map((statement: any) => (
            <StatementItem key={statement.id} statement={statement} />
          ))}
        </FilterForm>
      </div>
    </div>
  )
}
