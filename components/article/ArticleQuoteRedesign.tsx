import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'

const ArticleQuoteRedesignFragment = gql(`
  fragment ArticleQuoteRedesign on BlockQuoteNode {
    text
    speaker {
      avatar(size: small)
      fullName
      role
    }
  }
`)

export function ArticleQuoteRedesign(props: {
  node: FragmentType<typeof ArticleQuoteRedesignFragment>
}) {
  const data = useFragment(ArticleQuoteRedesignFragment, props.node)

  return (
    <div className="quote align-items-start fw-semibold mt-10 mx-3 text-start mt-lg-20 mx-lg-0">
      <blockquote className="blockquote fs-6 lh-base d-flex align-items-center mb-0">
        <span className="quote-mark fst-italic me-4 mt-minus-10px align-self-start me-lg-30px">
          ”
        </span>
        <div>
          <p className="mb-0 px-0 py-0 fw-semibold fst-italic">{data.text}</p>
          {data.speaker && (
            <div className="d-flex align-items-start mt-4 mt-lg-5">
              {data.speaker.avatar && (
                <img
                  className="me-4 me-lg-5 symbol-size rounded-circle bg-gray-500 overflow-hidden"
                  src={imagePath(data.speaker.avatar)}
                  alt={data.speaker.fullName}
                />
              )}

              <div className="mb-0 fs-8 fs-lg-5">
                <div className="fw-semibold">{data.speaker.fullName}</div>
                <div className="fw-normal">{data.speaker.role}</div>
              </div>
            </div>
          )}
        </div>
      </blockquote>
    </div>
  )
}
