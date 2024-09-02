import TitleIcon from '@/assets/icons/demagog.svg'
import client from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import Link from 'next/link'
import React from 'react'
import { SearchResultSpeaker } from '@/components/SearchResultSpeaker'
import { NextPageContext } from 'next'
import ArticleItem from '@/components/article/Item'
import StatementItem from '@/components/statement/Item'
import { SearchButton } from '@/components/search/SearchButton'
import type { SearchQuery } from '@/__generated__/graphql'

export async function getServerSideProps({ query }: NextPageContext) {
  const term = query?.q || ''

  const { data } = await client.query<SearchQuery>({
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

  return {
    props: {
      term,
      search: data,
    },
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

type Props = {
  term: string
  search: SearchQuery
}

const Search: React.FC<Props> = (props) => {
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
              defaultValue={props.term}
              className="input outline focus-primary fs-4 min-h-50px s-search-field"
              placeholder="Zadejte hledaný výraz…"
            />
            <SearchButton />
          </form>
        </div>
        {props.search.searchSpeakers.totalCount > 0 && (
          <div className="col col-12 s-section-speakers">
            <div className="w-100">
              <div className="d-flex">
                <span className="d-flex align-items-center me-2">
                  <TitleIcon />
                </span>
                <h2 className="display-5 fw-bold m-0 p-0">Nalezení politici</h2>
              </div>
              <div className="row row-cols-2 row-cols-lg-6 g-5">
                {props.search.searchSpeakers.speakers.map((speaker) => (
                  <SearchResultSpeaker key={speaker.id} speaker={speaker} />
                ))}
              </div>
              {props.search.searchSpeakers.totalCount > 4 && (
                <div className="my-5 d-flex">
                  <ShowMoreLink
                    link={`/vyhledavani/politici/?q=${props.term}`}
                    totalCount={props.search.searchSpeakers.totalCount}
                    contentType={'politiků'}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {props.search.searchArticles.totalCount > 0 && (
          <div className="col col-12 s-section-articles">
            <div className="d-flex mb-5">
              <span className="d-flex align-items-center me-2">
                <TitleIcon />
              </span>
              <h2 className="display-5 fw-bold m-0 p-0">Nalezené výstupy</h2>
            </div>
            <div className="row row-cols-1 row-cols-lg-2 g-5 g-lg-10">
              {props.search.searchArticles.articles.map((article) => (
                <ArticleItem key={article.id} article={article} />
              ))}
            </div>
            {props.search.searchArticles.totalCount > 6 && (
              <div className="my-5 d-flex">
                <ShowMoreLink
                  link={`/vyhledavani/vystupy/?q=${props.term}`}
                  totalCount={props.search.searchArticles.totalCount}
                  contentType={'výstupů'}
                />
              </div>
            )}
          </div>
        )}

        {props.search.searchStatements.totalCount > 0 && (
          <div className="col col-12 s-section-articles">
            <div className="d-flex mb-5">
              <span className="d-flex align-items-center me-2">
                <TitleIcon />
              </span>
              <h2 className="display-5 fw-bold m-0 p-0">Nalezené výroky</h2>
            </div>
            <div className="w-100">
              {props.search.searchStatements.statements.map((statement) => (
                <StatementItem key={statement.id} statement={statement} />
              ))}
            </div>
            {props.search.searchStatements.totalCount > 4 && (
              <div className="my-5 d-flex">
                <ShowMoreLink
                  link={`/vyhledavani/vyroky/?q=${props.term}`}
                  totalCount={props.search.searchStatements.totalCount}
                  contentType={'výroků'}
                />
              </div>
            )}
          </div>
        )}

        {props.term.length > 0 &&
          !props.search.searchArticles.totalCount &&
          !props.search.searchSpeakers.totalCount &&
          !props.search.searchStatements.totalCount && (
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

export default Search
