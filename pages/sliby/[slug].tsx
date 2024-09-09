import client from '@/libs/apollo-client'
import TitleIcon from '@/assets/icons/promises.svg'

import { PromisesQuery } from '@/__generated__/graphql'
import { gql } from '@/__generated__'
import { ReactNode } from 'react'
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
import { NextPageContext } from 'next'
import { parsePage } from '@/libs/pagination'

const SEARCH_PAGE_SIZE = 2000

export async function getServerSideProps({
  params,
  query,
}: {
  params: { slug: string }
} & NextPageContext) {
  const term = getStringParam(query?.q)
  const page = parsePage(query?.page)

  const selectedTags = getNumericalArrayParams(query?.tags)
  const selectedPromiseRatings = getStringArrayParams(query?.promise_ratings)

  const { data } = await client.query<PromisesQuery>({
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
          ...PromiseStatsBanner
        }
      }
    `),
    variables: {
      slug: params?.slug ?? '',
      term: term,
      limit: SEARCH_PAGE_SIZE,
      offset: (page - 1) * SEARCH_PAGE_SIZE,
      filters: {
        tags: selectedTags,
        promiseRatings: selectedPromiseRatings,
      },
    },
  })

  return {
    props: {
      article: data.governmentPromisesEvaluationBySlug,
      term,
      page,
      selectedTags,
      selectedPromiseRatings,
    },
  }
}

type PromisesProps = {
  article: PromisesQuery['governmentPromisesEvaluationBySlug']
  term: string
  page: number
  selectedTags: number[]
  selectedPromiseRatings: string[]
}

export default function Promises(props: PromisesProps) {
  const { article } = props

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
        <div className="row g-10">
          <div className="col col-12 col-lg-6">
            <div className="mb-4">
              <span className="fs-6">
                S&nbsp;končícím volebním obdobím zpracoval Demagog.cz unikátní
                analýzu, nakolik menšinová vláda hnutí ANO a&nbsp;ČSSD splnila
                závazky, které si na začátku volebního období sama vytyčila.
                Vláda Andreje Babiše schválila své programové prohlášení
                27.&nbsp;června&nbsp;2018. Z&nbsp;něj jsme vybrali padesátku
                slibů napříč tématy a&nbsp;ty jsme po celé volební období
                průběžně sledovali.
              </span>
            </div>
            <div>
              <span className="fs-6">
                Nyní si tak můžete přečíst, jak si druhá Babišova vláda vedla
                v&nbsp;plnění slibů v&nbsp;oblasti hospodářství, životního
                prostředí, sociálního státu, vzdělanosti, právního státu
                a&nbsp;bezpečnosti. U&nbsp;každého slibu jsme na základě
                dohledávání primárních zdrojů informací zkoumali, zda se jej
                koalici podařilo naplnit. Pro potřeby tohoto výstupu pracujeme
                s&nbsp;třemi kategoriemi hodnocení — jde o&nbsp;sliby splněné,
                částečně splněné nebo porušené (více v{' '}
                <a href="https://demagog.cz/diskuze/overujeme-sliby-vlady-andreje-babise">
                  metodice
                </a>
                ). Cílem hodnocení není říct, zda vláda byla dobrá, nebo špatná,
                úspěšná, nebo neúspěšná. To si rozhodne každý volič
                8.&nbsp;a&nbsp;9.&nbsp;října u&nbsp;volební urny. Naším cílem
                bylo nabídnout veřejnosti tvrdá data a&nbsp;poctivou analýzu
                namísto impulzivních a zkratkovitých hodnocení, která
                s&nbsp;sebou nese (nejen) předvolební kampaň.
              </span>
            </div>
          </div>
          <div className="col col-12 col-lg-6">
            <div className="mb-4">
              <span className="fs-6">
                Z&nbsp;výsledků analýzy vyplývá, že z&nbsp;celkových 50 slibů
                vláda splnila 22 slibů, 13 splnila částečně a&nbsp;zbývajících
                15 slibů porušila.
              </span>
            </div>
            <div className="mb-4">
              <span className="fs-6">
                Druhá polovina funkčního období vlády byla charakterizována
                probíhající pandemií covidu-19. S&nbsp;ní spojené výzvy se
                pochopitelně podepsaly i&nbsp;na plnění programového prohlášení.
                Na naši metodiku hodnocení jednotlivých slibů to vliv nemělo,
                při čtení naší analýzy ale dopad pandemie na práci vlády mějte
                na paměti.
              </span>
            </div>
            <div className="mb-4">
              <span className="fs-6">
                Analýzu jsme zpracovali k&nbsp;17.&nbsp;září&nbsp;2021,
                s&nbsp;ohledem na případné legislativní posuny u&nbsp;některých
                slibů ji budeme do sněmovních voleb aktualizovat.
              </span>
            </div>
            <div>
              <span className="fs-6">
                Za podporu děkujeme Nadačnímu fondu pro nezávislou žurnalistiku.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <PromiseStatsBanner data={article} />

        <FilterForm
          hasAnyFilters={
            props.selectedPromiseRatings.length > 0 ||
            props.selectedTags.length > 0
          }
          renderFilters={(): ReactNode => (
            <>
              <FilterSection name="Oblast" defaultOpen>
                {props.article?.searchPromises?.tags?.map((tag) => (
                  <TagFilter
                    key={tag.tag.id}
                    tag={tag}
                    renderLabel={PromiseCount}
                  />
                ))}
              </FilterSection>

              <FilterSection
                name="Hodnocení"
                defaultOpen={props.selectedPromiseRatings.length > 0}
              >
                {props.article?.searchPromises?.promiseRatings?.map(
                  (promiseRating) => (
                    <PromiseRatingFilter
                      key={promiseRating.promiseRating.id}
                      promiseRating={promiseRating}
                    />
                  )
                )}
              </FilterSection>
            </>
          )}
          term={props.term}
          pageSize={SEARCH_PAGE_SIZE}
          page={props.page}
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
