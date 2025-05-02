import { query } from '@/libs/apollo-client'
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
import { gql } from '@/__generated__'
import { SpeakerLink } from '@/components/speaker/SpeakerLink'
import { PropsWithSearchParams } from '@/libs/params'
import { Metadata } from 'next'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { pluralize } from '@/libs/pluralize'
import { notFound, redirect } from 'next/navigation'
import { StatementFullExplanation } from '@/components/statement/StatementFullExplanation'
import { DefaultMetadata } from '@/libs/constants/metadata'
import { imagePath } from '@/libs/images/path'
import { TagFilters } from '@/components/filters/TagFilters'
import { VeracityFilters } from '@/components/filters/VeracityFilters'
import { ReleasedYearFilters } from '@/components/filters/ReleasedYearFilters'

const PAGE_SIZE = 10

export async function generateMetadata({
  params,
  searchParams,
}: PropsWithSearchParams<{ params: { slug: string } }>): Promise<Metadata> {
  if (searchParams.page === '1') {
    redirect(`/politici/${params.slug}`)
  }

  const page = parsePage(searchParams.page)

  const {
    data: { speakerV2: speaker },
  } = await query({
    query: gql(`
      query SpeakerDetailMetadata(
        $id: ID!
      ) {
        speakerV2(id: $id) {
          slug
          fullName
          firstName
          lastName
          body {
            shortName
          }
          verifiedStatementsCount
          avatar(size: detail)
        }
      }
    `),
    variables: {
      id: String(parseParamId(params.slug)),
    },
  })

  if (!speaker) {
    notFound()
  }

  const title = getMetadataTitle(
    speaker.body
      ? `${speaker.fullName} (${speaker.body.shortName})`
      : speaker.fullName
  )
  const description = `Demagog.cz ověřil již ${speaker.verifiedStatementsCount} ${pluralize(speaker.verifiedStatementsCount, 'faktický výrok', 'faktické výroky', 'faktických výroků')} politika*čky ${speaker.fullName}`
  const images = speaker.avatar ? { images: imagePath(speaker.avatar) } : {}
  const url = `${DefaultMetadata.openGraph?.url}/politici/${speaker.slug}`

  return {
    title,
    description,
    openGraph: {
      ...DefaultMetadata.openGraph,
      ...images,
      url,
      title,
      description,
      type: 'profile',
      firstName: speaker.firstName,
      lastName: speaker.lastName,
    },
    twitter: {
      ...DefaultMetadata.twitter,
      ...images,
      title,
      description,
      card: 'summary_large_image',
    },
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(
      page === 1
        ? `/politici/${speaker.slug}`
        : `/politici/${speaker.slug}?page=${page}`
    ),
  }
}

export default async function Speaker(
  props: PropsWithSearchParams<{ params: { slug: string } }>
) {
  const term = getStringParam(props.searchParams.q)
  const selectedTags = getStringArrayParams(props.searchParams.tags)
  const selectedYears = getNumericalArrayParams(props.searchParams.years)
  const selectedVeracities = getStringArrayParams(props.searchParams.veracities)
  const page = parsePage(props.searchParams.page)

  const {
    data: { speakerV2: speaker },
  } = await query({
    query: gql(`
        query SpeakerDetailQuery(
          $id: ID!
          $term: String!
          $limit: Int
          $offset: Int
          $filters: StatementFilterInput
        ) {
          speakerV2(id: $id) {
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
                ...StatementFullExplanation
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
      id: String(parseParamId(props.params.slug)),
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

  if (!speaker) {
    notFound()
  }

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  const hasAnyFilters =
    [...selectedVeracities, ...selectedYears, ...selectedTags].length > 0

  return (
    <div className="container">
      <div className="row g-5 justify-content-between mb-10">
        <div className="col col-12 col-md-6 col-lg-8">
          <div className="d-flex flex-wrap">
            <div className="w-125px position-relative me-5 me-lg-10 mb-5">
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
              <h1 className="display-1 fw-600 mb-1">{speaker.fullName}</h1>
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
                <span className="display-1 fw-bold">{speaker.stats?.true}</span>
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
                <span className="display-1 fw-bold">
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
                <span className="display-1 fw-bold">
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
                <span className="display-1 fw-bold">
                  {speaker.stats?.misleading}
                </span>
              </SpeakerLink>
            </div>
          </div>
        </div>
      </div>

      <FilterForm
        hasAnyFilters={hasAnyFilters}
        term={term}
        pageSize={PAGE_SIZE}
        page={page}
        totalCount={speaker.searchStatements.totalCount}
        renderFilters={
          <>
            <TagFilters data={speaker.searchStatements} />

            <VeracityFilters data={speaker.searchStatements} />

            <ReleasedYearFilters data={speaker.searchStatements} />
          </>
        }
        searchPlaceholder="Zadejte hledaný výrok"
      >
        {speaker.searchStatements.statements.map((statement) => (
          <StatementFullExplanation
            key={statement.id}
            statement={statement}
            className="mb-10"
          />
        ))}
      </FilterForm>
    </div>
  )
}
