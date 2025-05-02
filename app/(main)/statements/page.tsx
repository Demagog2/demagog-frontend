import TitleIcon from '@/assets/icons/statements.svg'
import { query } from '@/libs/apollo-client'
import { TAG_FILTER_INPUT_NAME } from '@/components/filtering/TagFilter'
import { parsePage } from '@/libs/pagination'

import { FilterForm } from '@/components/filtering/FilterForm'
import {
  getNumericalArrayParams,
  getStringArrayParams,
  getStringParam,
} from '@/libs/query-params'
import { gql } from '@/__generated__'
import { PropsWithSearchParams } from '@/libs/params'
import { Metadata } from 'next'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { StatementFullExplanation } from '@/components/statement/StatementFullExplanation'
import { TagFilters } from '@/components/filters/TagFilters'
import { VeracityFilters } from '@/components/filters/VeracityFilters'
import { ReleasedYearFilters } from '@/components/filters/ReleasedYearFilters'

const PAGE_SIZE = 10

export async function generateMetadata({
  searchParams,
}: PropsWithSearchParams): Promise<Metadata> {
  const page = parsePage(searchParams.page)

  return {
    title: getMetadataTitle('Přehled ověřených výroků'),
    description:
      'Za svou existenci Demagog.cz už ověřil tisíce výroků politiků a političek. V následujícím rozhraní můžete výroky volně procházet.',
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(page === 1 ? '/vyroky' : `/vyroky?page=${page}`),
  }
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
              ...StatementFullExplanation
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
            <h1 className="display-1 fw-bold m-0 p-0">
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
            <StatementFullExplanation
              key={statement.id}
              statement={statement}
              className="article-redesign mb-10"
            />
          ))}
        </FilterForm>
      </div>
    </div>
  )
}
