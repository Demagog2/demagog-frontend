import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerLink } from '../speaker/SpeakerLink'

export const ArticleSpeakerFragment = gql(`
  fragment ArticleSpeakerDetail on SourceSpeaker {
    id
    fullName
    speaker {
      ...SpeakerLink
      avatar(size: detail)
    }
  }
`)

export default function ArticleSpeaker(props: {
  speaker: FragmentType<typeof ArticleSpeakerFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const sourceSpeaker = useFragment(ArticleSpeakerFragment, props.speaker)

  return (
    <SpeakerLink
      speaker={sourceSpeaker.speaker}
      title={sourceSpeaker.fullName}
      className="symbol symbol-40px rounded-circle bg-gray-500 overflow-hidden margin-bottom"
    >
      <img
        width={36}
        height={36}
        src={mediaUrl + sourceSpeaker.speaker.avatar}
        alt={sourceSpeaker.fullName}
      />
    </SpeakerLink>
  )
}
