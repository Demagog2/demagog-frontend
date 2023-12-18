import type { NextPageContext } from 'next'
import PackmanIcon from '@/assets/icons/packman.svg'
import client from '@/libs/apollo-client'
import SpeakerItem, { SpeakerItemFragment } from '@/components/speaker/Item'
import gql from 'graphql-tag'
import { parsePage } from '@/libs/pagination'
import { FilterForm } from '@/components/statement/filtering/FilterForm'
import { useCallback } from 'react'
import { FilterSection } from '@/components/statement/filtering/FilterSection'
import { pluralize } from '@/libs/pluralize'

const PAGE_SIZE = 24

export async function getServerSideProps({ query }: NextPageContext) {
  const term = query?.q ?? ''
  const page = parsePage(query?.page)

  const { data: searchData } = await client.query({
    query: gql`
      query searchData($term: String!) {
        getPresidentAndGovermentSpeakers {
          ...SpeakerItemDetail
        }
        searchSpeakers(term: $term, includeAggregations: true) {
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
      ${SpeakerItemFragment}
    `,
    variables: {
      term,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    },
  })

  console.log(searchData.searchSpeakers)

  return {
    props: {
      term,
      page,
      presidentAndGovernmentalSpeakers:
        searchData.getPresidentAndGovermentSpeakers,
      speakerSearchResult: searchData.searchSpeakers,
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
            <div key={body.body.id} className="check-btn py-2">
              <input
                type="checkbox"
                name="bodies"
                value={body.body.id}
                defaultChecked={body.isSelected}
              />
              <span className="checkmark"></span>
              <span className="small fw-600 me-2">{body.body.displayName}</span>

              <span className="smallest min-w-40px">
                {body.count} {pluralize(body.count, 'osoba', 'osoby', 'osob')}
              </span>
            </div>
          ))}
        </FilterSection>
      ))}
    </>
  )
}

const Speakers = (props: SpeakersProps) => {
  const hasAnyFilters = false

  const renderFilters = useCallback(() => {
    return <BodyFilters bodyGroups={props.speakerSearchResult.bodyGroups} />
  }, [props.speakerSearchResult.bodyGroups])

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
