import { FragmentType, gql, useFragment } from '@/__generated__'
import formatDate from '@/libs/format-date'
import React from 'react'

const BlockQuoteMetadataFragment = gql(`
    fragment BlockQuoteMetadata on BlockQuoteNode {
      speaker {
        role
      }
      link
      medium
      quotedAt
    }
  `)

export function BlockQuoteMetadata(props: {
  data: FragmentType<typeof BlockQuoteMetadataFragment>
  className?: string
}) {
  const data = useFragment(BlockQuoteMetadataFragment, props.data)

  return (
    <>
      {(data.speaker?.role || data.quotedAt || data.medium || data.link) && (
        <div className={props.className}>
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
    </>
  )
}
