import TitleIcon from '@/assets/icons/statements.svg'
import { query } from '@/libs/apollo-client'
import StatementItem from '@/components/statement/Item'
import {
  TAG_FILTER_INPUT_NAME,
  TagFilter,
} from '@/components/filtering/TagFilter'
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
import { StatementCount } from '@/components/filtering/StatementCount'
import { PropsWithSearchParams } from '@/libs/params'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'

const PAGE_SIZE = 10

export const metadata: Metadata = {
  title: getMetadataTitle('Přehled ověřených výroků'),
  description:
    'Za svou existenci Demagog.cz už ověřil tisíce výroků politiků a političek. V následujícím rozhraní můžete výroky volně procházet.',
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

export default async function Statements(props: PropsWithSearchParams) {
  const term = getStringParam(props.searchParams.q)
  const selectedTags = getStringArrayParams(
    props.searchParams[TAG_FILTER_INPUT_NAME]
  )
  const selectedYears = getNumericalArrayParams(props.searchParams.years)
  const selectedVeracities = getStringArrayParams(props.searchParams.veracities)
  const page = parsePage(props.searchParams.page)

  const {
    data: { searchStatements },
  } = await query({
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
        tagsV2: selectedTags,
        veracities: selectedVeracities,
        years: selectedYears,
      },
    },
  })

  const hasAnyFilters =
    [...selectedVeracities, ...selectedYears, ...selectedTags].length > 0

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
          term={term}
          pageSize={PAGE_SIZE}
          page={page}
          totalCount={searchStatements.totalCount}
          renderFilters={
            <>
              <TagFilters data={searchStatements} />

              <VeracityFilters data={searchStatements} />

              <ReleasedYearFilters data={searchStatements} />
            </>
          }
          searchPlaceholder="Zadejte hledaný výrok"
        >
          {searchStatements.statements.map((statement) => (
            <StatementItem
              key={statement.id}
              statement={statement}
              className="mb-10"
            />
          ))}
        </FilterForm>
      </div>
    </div>
  )
}
