import client from '@/libs/apollo-client'
import StatementItem from '@/components/statement/Item'
import classNames from 'classnames'
import TrueIcon from '@/assets/icons/true.svg'
import UntrueIcon from '@/assets/icons/untrue.svg'
import UnverifiableIcon from '@/assets/icons/unverifiable.svg'
import MisleadingIcon from '@/assets/icons/misleading.svg'
import { FilterForm } from '@/components/filtering/FilterForm'
import {
  getNumericalArrayParams,
  getStringArrayParams,
  getStringParam,
  parseParamId,
} from '@/libs/query-params'
import { parsePage } from '@/libs/pagination'
import { NextPageContext } from 'next'
import { useCallback } from 'react'
import {
  ReleasedYearFilters,
  TagFilters,
  VeracityFilters,
} from '@/pages/vyroky'
import { gql } from '@/__generated__'
import { SpeakerDetailQueryQuery } from '@/__generated__/graphql'
import { SpeakerLink } from '@/components/speaker/SpeakerLink'

const PAGE_SIZE = 10

export async function getServerSideProps({
  query,
  params,
}: NextPageContext & { params: { id: string } }) {
  const term = getStringParam(query.q)
  const selectedTags = getNumericalArrayParams(query.tags)
  const selectedYears = getNumericalArrayParams(query.years)
  const selectedVeracities = getStringArrayParams(query.veracities)
  const page = parsePage(query.page)

  const { data } = await client.query({
    query: gql(`
      query SpeakerDetailQuery(
        $id: Int!
        $term: String!
        $limit: Int
        $offset: Int
        $filters: StatementFilterInput
      ) {
        speaker(id: $id) {
          id
          fullName
          avatar(size: detail)
          role
          body {
            shortName
          }
          stats {
            true
            misleading
            untrue
            unverifiable
          }
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
          ...SpeakerLink
        }
      }
    `),
    variables: {
      id: parseParamId(params.id),
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
      speaker: data.speaker,
      term,
      selectedVeracities,
      selectedYears,
      selectedTags,
      page,
    },
  }
}

interface SpeakerDetailProps {
  speaker: SpeakerDetailQueryQuery['speaker']
  term: string
  selectedVeracities: string[]
  selectedYears: number[]
  selectedTags: number[]
  page: number
}

const PoliticiDetail = (props: SpeakerDetailProps) => {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  const hasAnyFilters =
    [...props.selectedVeracities, ...props.selectedYears, ...props.selectedTags]
      .length > 0
  const { speaker } = props

  const renderFilters = useCallback(() => {
    return (
      <>
        <TagFilters data={speaker.searchStatements} />

        <VeracityFilters data={speaker.searchStatements} />

        <ReleasedYearFilters data={speaker.searchStatements} />
      </>
    )
  }, [speaker.searchStatements])

  return (
    <div className="container">
      <div className="row g-5 justify-content-between mb-10">
        <div className="col col-12 col-md-6 col-lg-8">
          <div className="d-flex flex-wrap">
            <div className="w-125px position-relative me-md-5 me-lg-10 mb-5 mb-md-0">
              {speaker.avatar && (
                <span className="symbol symbol-square symbol-circle">
                  <img src={mediaUrl + speaker.avatar} alt={speaker.fullName} />
                </span>
              )}
              {speaker.body && (
                <div className="symbol-label d-flex align-items-center justify-content-center w-45px h-45px rounded-circle bg-dark">
                  <span className="smallest text-white lh-1 text-center p-2">
                    {speaker.body.shortName}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="display-5 fw-600 mb-1">{speaker.fullName}</h1>
              <div className="mb-1">
                <span className="fs-4 fw-500">{speaker.role}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-12 col-md-6 col-lg-4 d-flex justify-content-end">
          <div
            className="d-flex mw-350px w-100"
            data-controller="components--stats"
          >
            <div className="me-5">
              <SpeakerLink
                className={classNames(
                  'd-flex',
                  'align-items-center',
                  'text-dark',
                  'mb-2',
                  {
                    'cursor-pointer': (speaker.stats?.true ?? 0) > 0,
                    'stat-link': (speaker.stats?.true ?? 0) > 0,
                  }
                )}
                speaker={speaker}
                queryParams="?veracities=true"
                title="Pravda"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-primary rounded-circle me-2">
                  <TrueIcon width={17} height={13} />
                </span>
                <span className="display-4 fs-bold">{speaker.stats?.true}</span>
              </SpeakerLink>

              <SpeakerLink
                className={classNames(
                  'd-flex',
                  'align-items-center',
                  'text-dark',
                  'mb-2',
                  {
                    'cursor-pointer': (speaker.stats?.unverifiable ?? 0) > 0,
                    'stat-link': (speaker.stats?.unverifiable ?? 0) > 0,
                  }
                )}
                speaker={speaker}
                queryParams="?veracities=unverifiable"
                title="Neověřitelné"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-gray rounded-circle me-2">
                  <UnverifiableIcon width={12} height={22} />
                </span>
                <span className="display-4 fs-bold">
                  {speaker.stats?.unverifiable}
                </span>
              </SpeakerLink>
            </div>
            <div>
              <SpeakerLink
                className={classNames(
                  'd-flex',
                  'align-items-center',
                  'text-dark',
                  'mb-2',
                  {
                    'cursor-pointer': (speaker.stats?.untrue ?? 0) > 0,
                    'stat-link': (speaker.stats?.untrue ?? 0) > 0,
                  }
                )}
                speaker={speaker}
                queryParams="?veracities=untrue"
                title="Nepravda"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-red rounded-circle me-2">
                  <UntrueIcon width={13} height={13} />
                </span>
                <span className="display-4 fs-bold">
                  {speaker.stats?.untrue}
                </span>
              </SpeakerLink>
              <SpeakerLink
                className={classNames(
                  'd-flex',
                  'align-items-center',
                  'text-dark',
                  'mb-2',
                  {
                    'cursor-pointer': (speaker.stats?.misleading ?? 0) > 0,
                    'stat-link': (speaker.stats?.misleading ?? 0) > 0,
                  }
                )}
                speaker={speaker}
                queryParams="?veracities=misleading"
                title="Zavádějící"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-secondary rounded-circle me-2">
                  <MisleadingIcon width={4} height={22} />
                </span>
                <span className="display-4 fs-bold">
                  {speaker.stats?.misleading}
                </span>
              </SpeakerLink>
            </div>
          </div>
        </div>
      </div>

      <FilterForm
        hasAnyFilters={hasAnyFilters}
        term={props.term}
        pageSize={PAGE_SIZE}
        page={props.page}
        totalCount={props.speaker.searchStatements.totalCount}
        renderFilters={renderFilters}
        searchPlaceholder="Zadejte hledaný výrok"
      >
        {speaker.searchStatements.statements.map((statement) => (
          <StatementItem key={statement.id} statement={statement} />
        ))}
      </FilterForm>
    </div>
  )
}

export default PoliticiDetail
