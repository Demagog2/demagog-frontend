import client from '../libs/apollo-client'
import ArticleTags from '../components/article/Tags'
import HomeSidebar from '@/components/site/HomeSidebar'
import DonateSidebar from '@/components/site/DonateSidebar'
import { MostSearchedSpeakers } from '@/components/speaker/MostSearchedSpeakers'
import { Metadata } from 'next'
import { HomepageDataQuery } from '@/__generated__/graphql'
import Link from 'next/link'
import { gql } from '@/__generated__'
import { Pagination } from '@/components/article/Pagination'
import { ArticleV2Preview } from '@/components/article/ArticleV2Preview'
import { notFound } from 'next/navigation'
import { drop, take } from 'lodash'

// TODO - Fetch more, paginations

export const metadata: Metadata = {
  title: 'Ověřujeme pro Vás',
}

interface HomeProps {
  data: HomepageDataQuery
}

export async function getStaticProps() {
  const { data } = await client.query<HomepageDataQuery>({
    query: gql(`
      query homepageData {
        homepageArticlesV3(first: 10) {
          nodes {
            ... on Article {
              id
            }
            ... on SingleStatementArticle {
              id
            }
            ...ArticleV2PreviewFragment
          }
          pageInfo {
            hasPreviousPage
            ...PaginationFragment
          }
        }
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
        ...MostSearchedSpeakers
      }
    `),
  })

  return {
    props: {
      data,
    },
  }
}

const Home: React.FC<HomeProps> = ({ data }) => {
  if (!data.homepageArticlesV3) {
    notFound()
  }

  const topArticles = take(data.homepageArticlesV3.nodes, 4)
  const bottomArticles = drop(data.homepageArticlesV3.nodes, 4)

  return (
    <>
      <div className="container">
        <div className="row g-5 g-lg-10 flex-lg-row-reverse">
          <div className="col col-12 col-lg-4">
            <div className="d-flex flex-wrap align-items-center mb-10">
              <span className="fs-7 fw-bold text-uppercase me-5 my-2">
                Nejvyhledávanější
              </span>
              <div className="symbol-group">
                <MostSearchedSpeakers speakers={data} />
              </div>
            </div>
            <HomeSidebar />
            <DonateSidebar />
          </div>
          <div className="col col-12 col-lg-8 mb-0 mb-lg-10">
            <div className="mb-5 mb-lg-10">
              <ArticleTags tags={data.articleTags} />
            </div>
            <div className="row row-cols-1 g-5 g-lg-10">
              {topArticles?.flatMap((article) => {
                if (!article) {
                  return null
                }

                return [
                  <ArticleV2Preview article={article} key={article?.id} />,
                ]
              })}
            </div>
          </div>
          <div className="col col-12"></div>
        </div>
        <div className="row row-cols-1 row-cols-lg-2 g-5 g-lg-10">
          {bottomArticles?.flatMap((article) => {
            if (!article) {
              return null
            }

            return [<ArticleV2Preview article={article} key={article?.id} />]
          })}
        </div>

        <Pagination pageInfo={data.homepageArticlesV3.pageInfo} />

        <div className="bg-light text-dark p-5 p-lg-10 rounded-l mt-10">
          <div className="row g-10 justify-content-between">
            <div className="col col-12 col-lg-5">
              <h2 className="display-5 mb-5 fw-bold">Workshopy</h2>
              <p className="fs-5 mb-5">
                V rámci 90 minut interaktivních seminářů pomůžeme nejen
                studentům středních škol v základní orientaci v mediální
                oblasti, předáme ale také znalost rozlišovat fakta od názorově
                zabarvených textů a prohloubíme rovněž kritické myšlení, což je
                pro dnešní dobu zcela zásadní dovednost.
              </p>
              <Link
                href="/stranka/workshopy-demagogcz"
                className="btn bg-primary h-44px"
              >
                <span>Zjistit více</span>
              </Link>
            </div>
            <div className="col col-12 col-lg-5">
              <img
                className="w-100 rounded-m"
                src="/images/workshop_default.jpg"
                alt="Workshopy"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
