import { FragmentType, gql, useFragment } from '@/__generated__'
import ArticleItem from './Item'
import { drop, take } from 'lodash'
import { TagIntro } from './ArticleTagIntro'
import DonateWidget from '@/components/site/DonateWidget'

const FacebookFactcheckFirstPageFragment = gql(`
    fragment FacebookFactcheckFirstPageFragment on ArticleConnection {
        nodes {
            id
            ...ArticleDetail
        }
    }
`)

export function FacebookFactcheckFirstPage(props: {
  data: FragmentType<typeof FacebookFactcheckFirstPageFragment>
  title: string
  description: JSX.Element
}) {
  const data = useFragment(FacebookFactcheckFirstPageFragment, props.data)
  return (
    <>
      <div className="col col-12 col-lg-4">
        <TagIntro {...props} />
        <DonateWidget />
      </div>
      <div className="col col-12 col-lg-8 mb-0 mb-lg-10">
        <div className="row row-cols-1 g-5 g-lg-10">
          {take(data.nodes, 4)?.flatMap((article) => {
            if (!article) {
              return []
            }

            return [
              <ArticleItem key={article?.id} article={article} largerPreview />,
            ]
          })}
        </div>
      </div>
      <div className="col col-12">
        <div className="row row-cols-1 row-cols-lg-2 g-5">
          {drop(data.nodes, 4)?.flatMap((article) => {
            if (!article) {
              return null
            }

            return [<ArticleItem key={article?.id} article={article} />]
          })}
        </div>
      </div>
    </>
  )
}
