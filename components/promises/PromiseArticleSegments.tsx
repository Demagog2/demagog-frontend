import { FragmentType, gql, useFragment } from '@/__generated__'

const PromiseArticleIntroFragment = gql(`
  fragment PromiseArticleIntro on GovernmentPromisesEvaluationArticle {
    segments {
      id
      segmentType
      textHtml
    }
  }
`)

export function PromiseArticleIntro(props: {
  data: FragmentType<typeof PromiseArticleIntroFragment>
}) {
  const data = useFragment(PromiseArticleIntroFragment, props.data)

  return (
    <div className="row g-10">
      {data.segments.flatMap((segment) => {
        if (segment.segmentType !== 'text') {
          return []
        }

        return [
          <div key={segment.id} className="col col-12 col-lg-6">
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: segment.textHtml ?? '' }}
            ></div>
          </div>,
        ]
      })}
    </div>
  )
}
