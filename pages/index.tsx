import client from '../libs/apollo-client'
import ArticleItem, { ArticleDetailFragment } from '../components/article/Item'
import ArticleTags, { ArticleTagsFragment } from '../components/article/Tags'
import HomeSidebar from '@/components/site/HomeSidebar'
import DonateSidebar from '@/components/site/DonateSidebar'
import { ArticleItem as ArticleItemType } from '@/libs/results-type'
import gql from 'graphql-tag'
import {
  MostSearchedSpeakerFragment,
  MostSearchedSpeakers,
} from '@/components/speaker/MostSearchedSpeakers'
import { Metadata } from 'next'

// TODO - Fetch more, paginations

export const metadata: Metadata = {
  title: 'Ověřujeme pro Vás',
}

interface HomeProps {
  articles: ArticleItemType[]
  tags: any
  mostSearchedSpeakers: any[]
}

export async function getStaticProps() {
  const { data: homepageData } = await client.query({
    query: gql`
      query homepageData {
        homepageArticles {
          ...ArticleDetail
        }
        getMostSearchedSpeakers {
          ...MostSearchedSpeakerDetail
        }
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
      }
      ${ArticleDetailFragment}
      ${MostSearchedSpeakerFragment}
      ${ArticleTagsFragment}
    `,
  })

  return {
    props: {
      articles: homepageData.homepageArticles,
      tags: homepageData.articleTags,
      mostSearchedSpeakers: homepageData.getMostSearchedSpeakers,
    },
  }
}

const Home: React.FC<HomeProps> = ({
  articles,
  tags,
  mostSearchedSpeakers,
}) => {
  const topArticles = articles.slice(0, 4)
  const bottomArticles =
    articles.length > 4 ? articles.slice(4, articles.length) : []
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
                <MostSearchedSpeakers speakers={mostSearchedSpeakers} />
              </div>
            </div>
            <HomeSidebar />
            <DonateSidebar />
          </div>
          <div className="col col-12 col-lg-8 mb-0 mb-lg-10">
            <div className="mb-5 mb-lg-10">
              <ArticleTags tags={tags} />
            </div>
            <div className="row row-cols-1 g-5 g-lg-10">
              {topArticles.map((article: any) => (
                <ArticleItem
                  article={article}
                  key={article.id}
                  prefix="/diskuze/"
                />
              ))}
            </div>
          </div>
          <div className="col col-12"></div>
        </div>
        <div className="row row-cols-1 row-cols-lg-2 g-5 g-lg-10">
          {bottomArticles.map((article: any) => (
            <ArticleItem
              article={article}
              key={article.id}
              prefix="/diskuze/"
            />
          ))}
        </div>
        <div className="mt-5 mt-lg-10">
          <a className="btn h-50px fs-6 me-2 mb-2 px-8">Načíst další</a>
        </div>

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
              <a
                href="/stranka/workshopy-demagogcz"
                className="btn bg-primary h-44px"
              >
                <span>Zjistit více</span>
              </a>
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
