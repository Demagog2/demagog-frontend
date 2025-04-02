import { displayDate } from '@/libs/date-time'
import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { useEffect, useState } from 'react'
import { PencilSquareIcon } from '@heroicons/react/20/solid'

interface BlockQuoteProps {
  children: React.ReactNode
  speakerId?: string
  speakerName?: string
  speakerCustomName?: string
  link?: string
  media?: string
  quotedAt?: string
  onEdit?: () => void
  className?: string
}

export function BlockQuote({
  children,
  speakerId,
  speakerName: initialSpeakerName,
  speakerCustomName,
  link,
  media,
  quotedAt,
  onEdit,
  className = '',
}: BlockQuoteProps) {
  const [speakerName, setSpeakerName] = useState(initialSpeakerName)

  useEffect(() => {
    if (speakerId && !initialSpeakerName) {
      query({
        query: gql(`
          query BlockQuotePluginDetail($id: ID!) {
            speakerV2(id: $id) {
              fullName
            }
          }
        `),
        variables: {
          id: speakerId,
        },
      }).then((payload) => {
        if (payload.data.speakerV2) {
          setSpeakerName(payload.data.speakerV2.fullName)
        }
      })
    }
  }, [speakerId, initialSpeakerName])

  return (
    <blockquote
      className={`relative bg-gray-50 p-6 my-6 text-lg border-l-4 border-gray-200 ${className}`}
    >
      {children}
      <span className="block text-sm text-gray-600 mt-4">
        {speakerCustomName || speakerName}
        {media && (
          <>
            {' '}
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {media}
              </a>
            ) : (
              media
            )}
          </>
        )}
        {quotedAt && ` (${displayDate(quotedAt)})`}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          title="Upravit citát"
        >
          <PencilSquareIcon className="w-5 h-5" />
        </button>
      )}
    </blockquote>
  )
}
