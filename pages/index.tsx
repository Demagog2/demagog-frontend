import { GetArticles } from '../libs/queries'
import client from '../libs/apollo-client'
import ArticleItem from '../components/article/Item'
import ArticleTags, { ArticleTagsFragment } from '../components/article/Tags'
import { useState } from 'react'
import HomeSidebar from '@/components/site/HomeSidebar'
import DonateSidebar from '@/components/site/DonateSidebar'
import { ArticleItem as ArticleItemType } from '@/libs/results-type'
import gql from 'graphql-tag'
import {
  MostSearchedSpeakerFragment,
  MostSearchedSpeakers,
} from '@/components/speaker/MostSearchedSpeakers'

// TODO - Fetch more, paginations

interface HomeProps {
  articles: ArticleItemType[]
  tags: any
  mostSearchedSpeakers: any[]
}

const PAGE_SIZE = 10

export async function getStaticProps() {
  const { data: articles } = await client.query({
    query: GetArticles,
    variables: {
      offset: 0,
      limit: 10,
    },
  })

  const { data: homepageData } = await client.query({
    query: gql`
      query homepageData {
        getMostSearchedSpeakers {
          ...MostSearchedSpeakerDetail
        }
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
      }
      ${MostSearchedSpeakerFragment}
      ${ArticleTagsFragment}
    `,
  })

  return {
    props: {
      articles: articles.articles,
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
  const [offset, setOffset] = useState(PAGE_SIZE)
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
      </div>
    </>
  )
}

export default Home
