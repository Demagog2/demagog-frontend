import { FragmentType, gql, useFragment } from '@/__generated__'
import formatDate from '@/libs/format-date'
import { imagePath } from '@/libs/images/path'
import classNames from 'classnames'
import React from 'react'

const ArticleQuoteFragment = gql(`
  fragment ArticleQuote on BlockQuoteNode {
    text
    speaker {
      avatar(size: small)
      fullName
      role
    }
    link
    medium
    quotedAt
  }
`)

export function ArticleQuote(props: {
  node: FragmentType<typeof ArticleQuoteFragment>
  isQuoteInAccordion?: boolean
}) {
  const data = useFragment(ArticleQuoteFragment, props.node)

  return (
    <div
      className={classNames(
        'quote align-items-start fw-semibold mt-10 mx-3 text-start mt-lg-20 mx-lg-0',
        {
          'quote-in-accordion': props.isQuoteInAccordion,
        }
      )}
    >
      <blockquote className="blockquote fs-6 lh-base d-flex align-items-start mb-0">
        <span
          className={classNames(
            'quote-mark fst-italic me-4  align-self-start mt-minus-10px',
            {
              'me-lg-30px': !props.isQuoteInAccordion,
              'me-lg-20px': props.isQuoteInAccordion,
            }
          )}
        >
          ”
        </span>
        <div>
          <p
            className={classNames(
              'mb-0 px-0 py-0 fw-semibold fst-italic fs-7',
              {
                'fs-lg-2': !props.isQuoteInAccordion,
              }
            )}
          >
            {data.text}
          </p>
          {(data.speaker || data.quotedAt || data.medium || data.link) && (
            <div className="d-flex align-items-center mt-4 mt-lg-5">
              {data.speaker?.avatar && (
                <img
                  className="me-4 me-lg-5 symbol-size rounded-circle bg-gray-500 overflow-hidden flex-shrink-0"
                  src={imagePath(data.speaker.avatar)}
                  alt={data.speaker.fullName}
                />
              )}

              <div
                className={classNames('mb-0 fs-8', {
                  'fs-lg-5': !props.isQuoteInAccordion,
                })}
              >
                {data.speaker?.fullName && (
                  <div className="fw-semibold">{data.speaker?.fullName}</div>
                )}

                {(data.speaker?.role ||
                  data.quotedAt ||
                  data.medium ||
                  data.link) && (
                  <div className="fw-normal">
                    {[
                      data.speaker?.role,
                      data.link && data.medium ? (
                        <a href={data.link}>{data.medium}</a>
                      ) : data.link ? (
                        <a href={data.link}>odkaz</a>
                      ) : (
                        data.medium
                      ),
                      data.quotedAt && formatDate(data.quotedAt),
                    ]
                      .filter(Boolean)
                      .map((item, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && ', '}
                          {item}
                        </React.Fragment>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </blockquote>
    </div>
  )
}
