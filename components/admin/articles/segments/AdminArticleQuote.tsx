import { FragmentType, gql, useFragment } from '@/__generated__'
import formatDate from '@/libs/format-date'
import { imagePath } from '@/libs/images/path'
import React from 'react'

const AdminArticleQuoteFragment = gql(`
  fragment AdminArticleQuote on BlockQuoteNode {
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

export function AdminArticleQuote(props: {
  node: FragmentType<typeof AdminArticleQuoteFragment>
}) {
  const data = useFragment(AdminArticleQuoteFragment, props.node)

  return (
    <figure className="mt-10 border-l border-indigo-600 pl-9">
      <blockquote className="font-semibold text-gray-900">
        <p>{data.text}</p>
      </blockquote>

      {(data.speaker || data.quotedAt || data.medium || data.link) && (
        <figcaption className="mt-10 flex items-center gap-x-6">
          {data.speaker?.avatar && (
            <img
              alt={data.speaker.fullName}
              src={imagePath(data.speaker.avatar)}
              className="avatar size-12 bg-gray-50 me-1"
            />
          )}

          <div className="text-sm/6">
            {data.speaker?.fullName && (
              <div className="font-semibold text-gray-900">
                {data.speaker?.fullName}
              </div>
            )}

            {(data.speaker?.role ||
              data.quotedAt ||
              data.medium ||
              data.link) && (
              <div className="mt-0.5 text-gray-600">
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
        </figcaption>
      )}
    </figure>
  )
}
