import TitleIcon from '@/assets/icons/demagog.svg'
import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import Link from 'next/link'
import React from 'react'
import { SearchResultSpeaker } from '@/components/SearchResultSpeaker'
import ArticleItem from '@/components/article/Item'
import StatementItem from '@/components/statement/Item'
import { SearchButton } from '@/components/search/SearchButton'
import type { SearchQuery } from '@/__generated__/graphql'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'

export async function generateMetadata(
  props: PropsWithSearchParams
): Promise<Metadata> {
  return {
    title: getMetadataTitle(
      props.searchParams.q
        ? `Vyhledávání: ${props.searchParams.q}`
        : 'Vyhledávání'
    ),
    description:
      'Hledejte mezi výstupy Demagog.cz, konkrétními faktickými výroky či v databázi politiků a političek',
  }
}

function ShowMoreLink(props: {
  link: string
  totalCount: number
  contentType: string
}) {
  return (
    <Link href={props.link} className="btn h-50px px-8 fs-6 s-more">
      Zobrazit všech {props.totalCount} {props.contentType} &rarr;
    </Link>
  )
}

export default async function Search(props: PropsWithSearchParams) {
  const term = getStringParam(props.searchParams.q)

  const { data } = await query<SearchQuery>({
    query: gql(`
      query search($term: String!) {
        searchSpeakers(term: $term, limit: 4) {
          speakers {
            id
            ...SearchResultSpeakerDetail
          }
          totalCount
        }
        searchArticles(term: $term, limit: 6) {
          articles {
            id
            ...ArticleDetail
          }
          totalCount
        }
        searchStatements(term: $term, limit: 4) {
          statements {
            id
            ...StatementDetail
          }
          totalCount
        }
      }
    `),
    variables: {
      term,
    },
  })

  return (
    <div className="container">
      <div className="row g-5 g-lg-10 justify-content-center">
        <div className="col col-12 col-lg-8">
          <form
            className="position-relative"
            action="/vyhledavani"
            acceptCharset="UTF-8"
            method="get"
          >
            <input
              type="text"
              name="q"
              id="q"
              defaultValue={term}
              className="input outline focus-primary fs-4 min-h-50px s-search-field"
              placeholder="Zadejte hledaný výraz…"
            />
            <SearchButton />
          </form>
        </div>
        {data.searchSpeakers.totalCount > 0 && (
          <div className="col col-12 s-section-speakers">
            <div className="w-100">
              <div className="d-flex">
                <span className="d-flex align-items-center me-2">
                  <TitleIcon />
                </span>
                <h2 className="display-5 fw-bold m-0 p-0">Nalezení politici</h2>
              </div>
              <div className="row row-cols-2 row-cols-lg-6 g-5">
                {data.searchSpeakers.speakers.map((speaker) => (
                  <SearchResultSpeaker key={speaker.id} speaker={speaker} />
                ))}
              </div>
              {data.searchSpeakers.totalCount > 4 && (
                <div className="my-5 d-flex">
                  <ShowMoreLink
                    link={`/vyhledavani/politici/?q=${term}`}
                    totalCount={data.searchSpeakers.totalCount}
                    contentType={'politiků'}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {data.searchArticles.totalCount > 0 && (
          <div className="col col-12 s-section-articles">
            <div className="d-flex mb-5">
              <span className="d-flex align-items-center me-2">
                <TitleIcon />
              </span>
              <h2 className="display-5 fw-bold m-0 p-0">Nalezené výstupy</h2>
            </div>
            <div className="row row-cols-1 row-cols-lg-2 g-5 g-lg-10">
              {data.searchArticles.articles.map((article) => (
                <ArticleItem key={article.id} article={article} />
              ))}
            </div>
            {data.searchArticles.totalCount > 6 && (
              <div className="my-5 d-flex">
                <ShowMoreLink
                  link={`/vyhledavani/vystupy/?q=${term}`}
                  totalCount={data.searchArticles.totalCount}
                  contentType={'výstupů'}
                />
              </div>
            )}
          </div>
        )}

        {data.searchStatements.totalCount > 0 && (
          <div className="col col-12 s-section-articles">
            <div className="d-flex mb-5">
              <span className="d-flex align-items-center me-2">
                <TitleIcon />
              </span>
              <h2 className="display-5 fw-bold m-0 p-0">Nalezené výroky</h2>
            </div>
            <div className="w-100">
              {data.searchStatements.statements.map((statement) => (
                <StatementItem key={statement.id} statement={statement} />
              ))}
            </div>
            {data.searchStatements.totalCount > 4 && (
              <div className="my-5 d-flex">
                <ShowMoreLink
                  link={`/vyhledavani/vyroky/?q=${term}`}
                  totalCount={data.searchStatements.totalCount}
                  contentType={'výroků'}
                />
              </div>
            )}
          </div>
        )}

        {term.length > 0 &&
          !data.searchArticles.totalCount &&
          !data.searchSpeakers.totalCount &&
          !data.searchStatements.totalCount && (
            <div className="col col-12 min-h-25vh py-10 text-center">
              <h1 className="display-4 fw-bold">
                Nenašli jsme nic, co by odpovídalo Vašemu hledanému výrazu.
              </h1>
            </div>
          )}
      </div>
    </div>
  )
}
