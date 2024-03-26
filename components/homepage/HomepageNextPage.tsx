import { ArticleV2Preview } from '../article/ArticleV2Preview'
import { Pagination } from '../article/Pagination'
import ArticleTags from '../article/Tags'
import { HomepageDataQuery } from '@/__generated__/graphql'

type Props = {
  data: HomepageDataQuery
}

export function HomepageNextPage({ data }: Props) {
  return (
    <div className="container">
      <div className="row g-5 g-lg-10 flex-lg-row-reverse">
        <div className="col col-12">
          <ArticleTags tags={data.articleTags} />
        </div>
        <div className="col col-12">
          <div className="row row-cols-1 row-cols-lg-2 g-10">
            {data.homepageArticlesV3.nodes?.flatMap((article) => {
              if (!article) {
                return null
              }

              return [<ArticleV2Preview article={article} key={article?.id} />]
            })}
          </div>
        </div>

        <Pagination pageInfo={data.homepageArticlesV3.pageInfo} />
      </div>
    </div>
  )
}
