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
    <div className="quote align-items-start fw-semibold mt-39px mx-3 text-start mt-lg-87px mx-lg-0 fs-lg-96px">
      <blockquote className="blockquote fs-6 lh-base d-flex align-items-center mb-0">
        <span className="fs-64 quote-mark fst-italic me-4 mt-minus-10px align-self-start fs-lg-96px me-lg-30px">
          ”
        </span>
        <div>
          <p className="mb-0 px-0 py-0 fw-semibold fs-lg-24px fst-italic">
            {data.text}
          </p>
          {data.speaker && (
            <div className="d-flex align-items-start mt-4 mt-lg-5">
              {data.speaker.avatar && (
                <img
                  className="me-4 me-lg-5 symbol-size rounded-circle bg-gray-500 overflow-hidden"
                  src={imagePath(data.speaker.avatar)}
                  alt={data.speaker.fullName}
                />
              )}

              <div className="mb-0 fs-7 fs-lg-5">
                <p className="fw-semibold">{data.speaker.fullName}</p>
                <p className="fw-normal">{data.speaker.role}</p>
              </div>
            </div>
          )}
        </div>
      </blockquote>
    </div>
  )
}
