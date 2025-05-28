import HomeSidebar from '@/components/site/HomeSidebar'
import DonateWidget from '@/components/site/DonateWidget'
import { MostSearchedSpeakers } from '@/components/speaker/MostSearchedSpeakers'
import { ArticleV2Preview } from '@/components/article/ArticleV2Preview'
import { drop, take } from 'lodash'
import { HomepageDataQuery } from '@/__generated__/graphql'
import { Pagination } from '../article/Pagination'

export function HomepageFirstPage({
  data,
  articlesPageEnabled,
}: {
  data: HomepageDataQuery
  articlesPageEnabled: boolean
}) {
  const topArticles = take(data.homepageArticlesV3.nodes, 4)
  const bottomArticles = drop(data.homepageArticlesV3.nodes, 4)

  return (
    <div className="container">
      <div className="row g-5 g-lg-10 flex-lg-row-reverse">
        <div className="col col-12 col-lg-4">
          <div className="d-flex flex-wrap align-items-center mb-10">
            <span className="fs-8 fw-bold text-uppercase me-5 my-2">
              Nejvyhledávanější
            </span>
            <MostSearchedSpeakers speakers={data} />
          </div>
          <HomeSidebar />
          <DonateWidget />
        </div>
        <div className="col col-12 col-lg-8 mb-0 mb-lg-10">
          <div className="row row-cols-1 g-5 g-lg-10">
            {topArticles?.flatMap((article) => {
              if (!article) {
                return null
              }

              return [
                <ArticleV2Preview
                  article={article}
                  key={article?.id}
                  largerPreview
                />,
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

        {articlesPageEnabled ? (
          <div className="d-flex">
            <a
              href={'/diskuze'}
              className="btn h-50px fs-6 me-2 mb-2 px-8 w-auto"
            >
              <span>Zobrazit všechny články</span>
            </a>
          </div>
        ) : (
          <Pagination pageInfo={data.homepageArticlesV3.pageInfo} />
        )}
      </div>

      <div className="bg-light text-dark p-5 p-lg-10 rounded-l mt-10">
        <div className="row g-10 justify-content-between">
          <div className="col col-12 col-lg-5">
            <h2 className="display-2 mb-5 fw-bold">Workshopy</h2>
            <p className="fs-5 mb-5">
              V rámci 90 minut interaktivních seminářů pomůžeme nejen studentům
              středních škol v základní orientaci v mediální oblasti, předáme
              ale také znalost rozlišovat fakta od názorově zabarvených textů a
              prohloubíme rovněž kritické myšlení, což je pro dnešní dobu zcela
              zásadní dovednost.
            </p>
            <a href="/workshopy" className="btn bg-primary h-44px">
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
  )
}
