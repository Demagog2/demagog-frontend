import { query } from '@/libs/apollo-client'
import TitleIcon from '@/assets/icons/promises.svg'

import { PromisesQuery } from '@/__generated__/graphql'
import { gql } from '@/__generated__'
import { FilterSection } from '@/components/filtering/FilterSection'
import { PromiseStatsBanner } from '@/components/promises/stats/PromiseStatsBanner'
import { TagFilter } from '@/components/filtering/TagFilter'
import { FilterForm } from '@/components/filtering/FilterForm'
import { PromiseCount } from '@/components/filtering/PromiseCount'
import { PromiseRatingFilter } from '@/components/filtering/PromiseRatingFilter'
import { GovernmentalPromise } from '@/components/promises/GovernmentalPromise'
import {
  getNumericalArrayParams,
  getStringArrayParams,
  getStringParam,
} from '@/libs/query-params'
import { parsePage } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { PromiseArticleIntro } from '@/components/promises/PromiseArticleSegments'

const SEARCH_PAGE_SIZE = 2000

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { governmentPromisesEvaluationBySlug },
  } = await query({
    query: gql(`
      query PromiseDetailMetadata($slug: String!) {
        governmentPromisesEvaluationBySlug(slug: $slug) {
          title
        }
      }
    `),
    variables: {
      slug: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(governmentPromisesEvaluationBySlug?.title ?? ''),
  }
}

export default async function Promises(
  props: PropsWithSearchParams<{
    params: { slug: string }
  }>
) {
  const term = getStringParam(props.searchParams.q)
  const page = parsePage(props.searchParams.page)

  const selectedTags = getNumericalArrayParams(props.searchParams.tags)
  const selectedPromiseRatings = getStringArrayParams(
    props.searchParams.promise_ratings
  )

  const {
    data: { governmentPromisesEvaluationBySlug: article },
  } = await query<PromisesQuery>({
    query: gql(`
        query promises($slug: String!, $term: String!, $limit: Int, $offset: Int, $filters: PromiseFilterInput) {
          governmentPromisesEvaluationBySlug(slug: $slug) {
            id
            slug
            title
            perex
            searchPromises(term: $term, limit: $limit, offset: $offset, filters: $filters, includeAggregations: true) {
              promises {
                id
                ...GovernmentalPromiseDetail
              }
              tags {
                tag {
                  id
                }
                ...TagFilter
              }
              promiseRatings {
                promiseRating {
                  id
                }
                ...PromiseRatingFilter
              }
              totalCount
            }
            ...PromiseArticleIntro
            ...PromiseStatsBanner
          }
        }
      `),
    variables: {
      slug: props.params.slug,
      term: term,
      limit: SEARCH_PAGE_SIZE,
      offset: (page - 1) * SEARCH_PAGE_SIZE,
      filters: {
        tags: selectedTags,
        promiseRatings: selectedPromiseRatings,
      },
    },
  })

  if (!article) {
    return null
  }

  return (
    <div className="container">
      <div className="section">
        <div className="row row g-5 mb-5">
          <div className="col col-12">
            <div className="d-flex">
              <span className="d-flex align-items-center me-2">
                <TitleIcon />
              </span>
              <h1 className="display-4 fw-bold m-0 p-0">{article.title}</h1>
            </div>
          </div>
          <div className="col col-12 col-lg-6">
            <span className="fs-2 fw-bold">{article.perex}</span>
          </div>
        </div>

        <PromiseArticleIntro data={article} />
      </div>
      <div className="section">
        <PromiseStatsBanner data={article} />

        <FilterForm
          hasAnyFilters={
            selectedPromiseRatings.length > 0 || selectedTags.length > 0
          }
          renderFilters={
            <>
              <FilterSection name="Oblast" defaultOpen>
                {article.searchPromises?.tags?.map((tag) => (
                  <TagFilter
                    key={tag.tag.id}
                    tag={tag}
                    renderLabel={PromiseCount}
                  />
                ))}
              </FilterSection>

              <FilterSection
                name="Hodnocení"
                defaultOpen={selectedPromiseRatings.length > 0}
              >
                {article.searchPromises?.promiseRatings?.map(
                  (promiseRating) => (
                    <PromiseRatingFilter
                      key={promiseRating.promiseRating.id}
                      promiseRating={promiseRating}
                    />
                  )
                )}
              </FilterSection>
            </>
          }
          term={term}
          pageSize={SEARCH_PAGE_SIZE}
          page={page}
          totalCount={article.searchPromises.totalCount}
          searchPlaceholder={'Hledat sliby'}
        >
          {article.searchPromises.promises.map((promise) => (
            <GovernmentalPromise slug={article.slug} promise={promise} />
          ))}
        </FilterForm>
      </div>
    </div>
  )
}
