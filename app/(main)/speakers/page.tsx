import PackmanIcon from '@/assets/icons/packman.svg'
import { query } from '@/libs/apollo-client'
import SpeakerItem from '@/components/speaker/Item'
import { parsePage } from '@/libs/pagination'
import { FilterForm } from '@/components/filtering/FilterForm'
import { FilterSection } from '@/components/filtering/FilterSection'
import { pluralize } from '@/libs/pluralize'
import { getStringArrayParams, getStringParam } from '@/libs/query-params'
import { FormCheckbox } from '@/components/filtering/controls/FormCheckbox'
import { PropsWithSearchParams } from '@/libs/params'
import { gql } from '@/__generated__'
import { Metadata } from 'next'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { redirect } from 'next/navigation'

const PAGE_SIZE = 24

export async function generateMetadata({
  searchParams,
}: PropsWithSearchParams): Promise<Metadata> {
  const page = parsePage(searchParams.page)

  if (searchParams.page === '1') {
    redirect('/vypis-recniku')
  }

  console.log('searchParams.page', searchParams.page)
  console.log('page', page)

  return {
    title: getMetadataTitle('Přehled politiků a političek'),
    description:
      'Za svou existenci Demagog.cz už ověřil výroky stovek politiků a političek.',
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(
      page === 1 ? '/vypis-recniku' : `/vypis-recniku?page=${page}`
    ),
  }
}

type BodyFilterProps = {
  bodyGroups: {
    name: string
    bodies: {
      body: {
        id: string
        filterKey: string
        displayName: string
      }
      isSelected: boolean
      count: number
    }[]
  }[]
}

const BODY_FILTER_INPUT_NAME = 'strana[]'

function BodyFilters(props: BodyFilterProps) {
  return (
    <>
      {props.bodyGroups.map((bodyGroup) => (
        <FilterSection key={bodyGroup.name} name={bodyGroup.name} defaultOpen>
          {bodyGroup.bodies.map((body) => (
            <FormCheckbox
              inputName={BODY_FILTER_INPUT_NAME}
              key={body.body.id}
              value={body.body.filterKey}
              name={body.body.displayName}
              isSelected={body.isSelected}
              label={
                <>
                  {body.count} {pluralize(body.count, 'osoba', 'osoby', 'osob')}
                </>
              }
            />
          ))}
        </FilterSection>
      ))}
    </>
  )
}

export default async function Speakers(props: PropsWithSearchParams) {
  const term = getStringParam(props.searchParams.q)
  const page = parsePage(props.searchParams?.page)
  const bodies = getStringArrayParams(
    props.searchParams[BODY_FILTER_INPUT_NAME]
  )

  const { data } = await query({
    query: gql(`
        query speakersSearch(
          $term: String!
          $limit: Int
          $offset: Int
          $filters: SpeakerFilterInput
          $includeGovernmentSpeakers: Boolean!
        ) {
          getPresidentAndGovernmentSpeakers
            @include(if: $includeGovernmentSpeakers) {
            id
            ...SpeakerItemDetail
          }
          searchSpeakers(
            term: $term
            limit: $limit
            offset: $offset
            includeAggregations: true
            filters: $filters
          ) {
            speakers {
              id
              ...SpeakerItemDetail
            }
            bodyGroups {
              name
              bodies {
                body {
                  id
                  filterKey
                  displayName
                }
                isSelected
                count
              }
            }
            totalCount
          }
        }
      `),
    variables: {
      term,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      filters: { bodies },
      includeGovernmentSpeakers: page === 1 && bodies.length === 0,
    },
  })

  const hasAnyFilters = bodies.length > 0

  return (
    <div className="container">
      <div className="row g-10">
        <div className="col col-12">
          <div className="d-flex align-items-center">
            <div className="h-35px me-2">
              <PackmanIcon className="h-35px" />
            </div>
            <h1 className="display-1 fw-bold m-0 p-0">
              Přehled politiků a političek
            </h1>
          </div>
        </div>
        <FilterForm
          hasAnyFilters={hasAnyFilters}
          term={term}
          pageSize={PAGE_SIZE}
          page={page}
          totalCount={data.searchSpeakers.totalCount}
          renderFilters={
            <BodyFilters bodyGroups={data.searchSpeakers.bodyGroups} />
          }
          searchPlaceholder="Zadejte jméno politika"
        >
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-10">
            {page === 1 &&
              term === '' &&
              data.getPresidentAndGovernmentSpeakers?.map((speaker) => (
                <SpeakerItem key={speaker.id} speaker={speaker} />
              ))}
            {data.searchSpeakers.speakers.map((speaker) => (
              <SpeakerItem key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </FilterForm>
      </div>
    </div>
  )
}
