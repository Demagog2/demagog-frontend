import Link from 'next/link'
import gql from 'graphql-tag'

export const ArticleSpeakerFragment = gql`
  fragment ArticleSpeakerDetail on SourceSpeaker {
    id
    firstName
    lastName
    speaker {
      avatar
    }
  }
`

export default function ArticleSpeaker({ speaker, prefix }: any) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  return (
    <Link
      href={prefix + speaker.speaker.id}
      title={speaker.firstName + ' ' + speaker.lastName}
      className="symbol symbol-40px rounded-circle bg-gray-500 overflow-hidden"
    >
      <img
        src={mediaUrl + speaker.speaker.avatar}
        alt={speaker.firstName + ' ' + speaker.lastName}
      />
    </Link>
  )
}
