import client from '@/libs/apollo-client'
import StatementItem, {
  StatementItemFragment,
} from '@/components/statement/Item'
import gql from 'graphql-tag'
import classNames from 'classnames'
import TrueIcon from '@/assets/icons/true.svg'
import UntrueIcon from '@/assets/icons/untrue.svg'
import UnverifiableIcon from '@/assets/icons/unverifiable.svg'
import MisleadingIcon from '@/assets/icons/misleading.svg'
import { FilterForm } from '@/components/filtering/FilterForm'
import { TagFilterFragment } from '@/components/filtering/TagFilter'
import { VeracityFilterFragment } from '@/components/filtering/VeracityFilter'
import { ReleasedYearFilterFragment } from '@/components/filtering/ReleasedYearFilter'
import {
  EditorPickedFilter,
  EditorPickedFilterFragment,
} from '@/components/filtering/EditorPickedFilter'
import {
  getBooleanParam,
  getNumericalArrayParams,
  getStringArrayParams,
} from '@/libs/query-params'
import { parsePage } from '@/libs/pagination'
import { NextPageContext } from 'next'
import { useCallback } from 'react'
import {
  ReleasedYearFilters,
  TagFilters,
  VeracityFilters,
} from '@/pages/vyroky'

const PAGE_SIZE = 10

export async function getServerSideProps({
  query,
  params,
}: NextPageContext & { params: { id: string } }) {
  const term = query?.q ?? ''
  const selectedTags = getNumericalArrayParams(query?.tags)
  const selectedYears = getNumericalArrayParams(query?.years)
  const selectedVeracities = getStringArrayParams(query?.veracities)
  const editorPickedSelected = getBooleanParam(query?.editorPicked)
  const page = parsePage(query?.page)

  const { data } = await client.query({
    query: gql`
      query SpeakerDetailQuery(
        $id: Int!
        $term: String!
        $limit: Int
        $offset: Int
        $filters: StatementFilterInput
      ) {
        speaker(id: $id) {
          fullName
          avatar
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
      }
      ${StatementItemFragment}
      ${TagFilterFragment}
      ${VeracityFilterFragment}
      ${ReleasedYearFilterFragment}
      ${EditorPickedFilterFragment}
    `,
    variables: {
      id: parseInt(params.id, 10),
      offset: (page - 1) * PAGE_SIZE,
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
      speaker: data.speaker,
      term,
      selectedVeracities,
      selectedYears,
      selectedTags,
      editorPickedSelected,
      page,
    },
  }
}

interface SpeakerDetailProps {
  speaker: any
  term: string
  selectedVeracities: string[]
  selectedYears: number[]
  selectedTags: number[]
  editorPickedSelected: boolean
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
        <TagFilters tags={speaker.searchStatements.tags} />

        <VeracityFilters veracities={speaker.searchStatements.veracities} />

        <ReleasedYearFilters years={speaker.searchStatements.years} />

        <EditorPickedFilter
          count={speaker.searchStatements.editorPicked.count}
          isSelected={speaker.searchStatements.editorPicked.isSelected}
        />
      </>
    )
  }, [
    speaker.searchStatements.editorPicked.count,
    speaker.searchStatements.editorPicked.isSelected,
    speaker.searchStatements.tags,
    speaker.searchStatements.veracities,
    speaker.searchStatements.years,
  ])

  return (
    <div className="container">
      <div className="row g-5 justify-content-between mb-10">
        <div className="col col-12 col-md-6 col-lg-8">
          <div className="d-flex flex-wrap">
            <div className="w-125px position-relative me-md-5 me-lg-10 mb-5 mb-md-0">
              <span className="symbol symbol-square symbol-circle">
                <img src={mediaUrl + speaker.avatar} alt={speaker.fullName} />
              </span>
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
              <div
                className={classNames('d-flex', 'align-items-center', 'mb-2', {
                  'cursor-pointer': speaker.stats.true > 0,
                  'stat-link': speaker.stats.true > 0,
                })}
                data-action="click->components--stats#toggleLink"
                data-url="?hodnoceni[]=pravda"
                data-count={speaker.stats.true}
                title="Pravda"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-primary rounded-circle me-2">
                  <TrueIcon width={17} height={13} />
                </span>
                <span className="display-4 fs-bold">{speaker.stats.true}</span>
              </div>
              <div
                className={classNames('d-flex', 'align-items-center', 'mb-2', {
                  'cursor-pointer': speaker.stats.unverifiable > 0,
                  'stat-link': speaker.stats.unverifiable > 0,
                })}
                data-url="?hodnoceni[]=neoveritelne"
                data-action="click->components--stats#toggleLink"
                data-count={speaker.stats.unverifiable}
                title="Neověřitelné"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-gray rounded-circle me-2">
                  <UnverifiableIcon width={12} height={22} />
                </span>
                <span className="display-4 fs-bold">
                  {speaker.stats.unverifiable}
                </span>
              </div>
            </div>
            <div>
              <div
                className={classNames('d-flex', 'align-items-center', 'mb-2', {
                  'cursor-pointer': speaker.stats.untrue > 0,
                  'stat-link': speaker.stats.untrue > 0,
                })}
                data-action="click->components--stats#toggleLink"
                data-url="?hodnoceni[]=nepravda"
                data-count={speaker.stats.untrue}
                title="Nepravda"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-red rounded-circle me-2">
                  <UntrueIcon width={13} height={13} />
                </span>
                <span className="display-4 fs-bold">
                  {speaker.stats.untrue}
                </span>
              </div>
              <div
                className={classNames('d-flex', 'align-items-center', 'mb-2', {
                  'cursor-pointer': speaker.stats.misleading > 0,
                  'stat-link': speaker.stats.misleading > 0,
                })}
                data-action="click->components--stats#toggleLink"
                data-url="?hodnoceni[]=zavadejici"
                data-count={speaker.stats.misleading}
                title="Zavádějící"
              >
                <span className="w-40px h-40px d-flex align-items-center justify-content-center bg-secondary rounded-circle me-2">
                  <MisleadingIcon width={4} height={22} />
                </span>
                <span className="display-4 fs-bold">
                  {speaker.stats.misleading}
                </span>
              </div>
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
        {speaker.searchStatements.statements.map((statement: any) => (
          <StatementItem key={statement.id} statement={statement} />
        ))}
      </FilterForm>
    </div>
  )
}

export default PoliticiDetail
