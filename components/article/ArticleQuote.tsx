import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import classNames from 'classnames'

const ArticleQuoteFragment = gql(`
  fragment ArticleQuote on BlockQuoteNode {
    text
    speaker {
      avatar(size: small)
      fullName
      role
    }
  }
`)

export function ArticleQuote(props: {
  node: FragmentType<typeof ArticleQuoteFragment>
  className?: string
}) {
  const data = useFragment(ArticleQuoteFragment, props.node)

  return (
    <div
      className={`${props.className} quote align-items-start fw-semibold mt-10 mx-3 text-start mt-lg-20 mx-lg-0`}
    >
      <blockquote className="blockquote fs-6 lh-base d-flex align-items-center mb-0">
        <span
          className={classNames(
            'quote-mark fst-italic me-4 mt-minus-10px align-self-start',
            { 'me-lg-30px': !props.className, 'me-lg-20px': props.className }
          )}
        >
          ”
        </span>
        <div>
          <p
            className={classNames(
              'mb-0 px-0 py-0 fw-semibold fst-italic fs-7',
              { 'fs-lg-2': !props.className }
            )}
          >
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

              <div
                className={classNames('mb-0 fs-8', {
                  'fs-lg-5': !props.className,
                })}
              >
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
