import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import React from 'react'
import { BlockQuoteMetadata } from '@/components/article/BlockQuoteMetadata'

const AdminArticleQuoteFragment = gql(`
  fragment AdminArticleQuote on BlockQuoteNode {
    text
    speakerV2 {
      ... on Speaker {
        avatar(size: small)
        fullName
        role
      }
      ... on SpeakerWithCustomName {
        name
      }
    }
    link
    medium
    quotedAt
    ...BlockQuoteMetadata
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

      {(data.speakerV2 || data.quotedAt || data.medium || data.link) && (
        <figcaption className="mt-10 flex items-center gap-x-6">
          {data.speakerV2?.__typename === 'Speaker' &&
            data.speakerV2.avatar && (
              <img
                alt={data.speakerV2.fullName}
                src={imagePath(data.speakerV2.avatar)}
                className="avatar size-12 bg-gray-50 me-1"
              />
            )}

          <div className="text-sm/6">
            {data.speakerV2?.__typename === 'Speaker' && (
              <div className="font-semibold text-gray-900">
                {data.speakerV2.fullName}
              </div>
            )}
            {data.speakerV2?.__typename === 'SpeakerWithCustomName' && (
              <div className="font-semibold text-gray-900">
                {data.speakerV2.name}
              </div>
            )}

            <BlockQuoteMetadata data={data} className="mt-0.5 text-gray-600" />
          </div>
        </figcaption>
      )}
    </figure>
  )
}
