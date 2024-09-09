import type { NextPageContext } from 'next'
import PackmanIcon from '@/assets/icons/packman.svg'
import client from '@/libs/apollo-client'
import SpeakerItem, { SpeakerItemFragment } from '@/components/speaker/Item'
import { parsePage } from '@/libs/pagination'
import { FilterForm } from '@/components/filtering/FilterForm'
import { useCallback } from 'react'
import { FilterSection } from '@/components/filtering/FilterSection'
import { pluralize } from '@/libs/pluralize'
import { getNumericalArrayParams } from '@/libs/query-params'
import { FormCheckbox } from '@/components/filtering/controls/FormCheckbox'
import { gql } from '@/__generated__'

const PAGE_SIZE = 24

export async function getServerSideProps({ query }: NextPageContext) {
  const term = query?.q ?? ''
  const page = parsePage(query?.page)
  const bodies = getNumericalArrayParams(query?.bodies)

  const { data } = await client.query({
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
            ...SpeakerItemDetail
          }
          bodyGroups {
            name
            bodies {
              body {
                id
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
      filter: { bodies },
      includeGovernmentSpeakers: page === 1,
    },
  })

  return {
    props: {
      term,
      page,
      presidentAndGovernmentalSpeakers:
        data.getPresidentAndGovernmentSpeakers ?? [],
      speakerSearchResult: data.searchSpeakers,
      selectedBodies: bodies,
    },
  }
}

type SpeakersProps = {
  term: string
  page: number
  presidentAndGovernmentalSpeakers: any[]
  speakerSearchResult: {
    speakers: any[]
    totalCount: number
    bodyGroups: {
      name: string
      bodies: {
        body: {
          id: string
          displayName: string
        }
        isSelected: boolean
        count: number
      }[]
    }[]
  }
  selectedBodies: number[]
}

type BodyFilterProps = {
  bodyGroups: {
    name: string
    bodies: {
      body: {
        id: string
        displayName: string
      }
      isSelected: boolean
      count: number
    }[]
  }[]
}

function BodyFilters(props: BodyFilterProps) {
  return (
    <>
      {props.bodyGroups.map((bodyGroup) => (
        <FilterSection key={bodyGroup.name} name={bodyGroup.name} defaultOpen>
          {bodyGroup.bodies.map((body) => (
            <FormCheckbox
              inputName="bodies"
              key={body.body.id}
              value={body.body.id}
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

const Speakers = (props: SpeakersProps) => {
  const hasAnyFilters = props.selectedBodies.length > 0

  const renderFilters = useCallback(
    () => <BodyFilters bodyGroups={props.speakerSearchResult.bodyGroups} />,
    [props.speakerSearchResult.bodyGroups]
  )

  return (
    <div className="container">
      <div className="row g-10">
        <div className="col col-12">
          <div className="d-flex align-items-center">
            <div className="h-35px me-2">
              <PackmanIcon className="h-35px" />
            </div>
            <h1 className="display-4 fw-bold m-0 p-0">
              Přehled politiků a političek
            </h1>
          </div>
        </div>
        <FilterForm
          hasAnyFilters={hasAnyFilters}
          term={props.term}
          pageSize={PAGE_SIZE}
          page={props.page}
          totalCount={props.speakerSearchResult.totalCount}
          renderFilters={renderFilters}
          searchPlaceholder="Zadejte jméno politika"
        >
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-10">
            {props.page === 1 &&
              props.term === '' &&
              props.presidentAndGovernmentalSpeakers.map((speaker) => (
                <SpeakerItem key={speaker.id} speaker={speaker} />
              ))}
            {props.speakerSearchResult.speakers.map((speaker) => (
              <SpeakerItem key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </FilterForm>
      </div>
    </div>
  )
}

export default Speakers
