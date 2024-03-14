import Link from 'next/link'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const ArticleSpeakerFragment = gql(`
  fragment ArticleSpeakerDetail on SourceSpeaker {
    id
    fullName
    speaker {
      avatar(size: detail)
    }
  }
`)

export default function ArticleSpeaker(props: {
  speaker: FragmentType<typeof ArticleSpeakerFragment>
  prefix: string
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const sourceSpeaker = useFragment(ArticleSpeakerFragment, props.speaker)

  return (
    <Link
      href={props.prefix + sourceSpeaker.id}
      title={sourceSpeaker.fullName}
      className="symbol symbol-40px rounded-circle bg-gray-500 overflow-hidden"
    >
      <img
        src={mediaUrl + sourceSpeaker.speaker.avatar}
        alt={sourceSpeaker.fullName}
      />
    </Link>
  )
}
