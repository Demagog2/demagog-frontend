import { FragmentType, gql, useFragment } from '@/__generated__'
import ArticleItem from './Item'

const FacebookFactcheckNextPageFragment = gql(`
    fragment FacebookFactcheckNextPageFragment on ArticleConnection {
        nodes {
            id
            ...ArticleDetail
        }
    }
`)

export function FacebookFactcheckNextPage(props: {
  data: FragmentType<typeof FacebookFactcheckNextPageFragment>
}) {
  const data = useFragment(FacebookFactcheckNextPageFragment, props.data)
  return (
    <div className="col col-12">
      <div className="row row-cols-1 row-cols-lg-2 g-5 g-lg-10">
        {data.nodes?.flatMap((article) => {
          if (!article) {
            return []
          }

          return [
            <ArticleItem
              key={article?.id}
              article={article}
              prefix="/diskuze/"
            />,
          ]
        })}
      </div>
    </div>
  )
}
