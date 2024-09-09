import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerLink } from './SpeakerLink'

export const MostSearchedSpeakersFragment = gql(`
  fragment MostSearchedSpeakers on Query {
    getMostSearchedSpeakers {
      id
      avatar(size: detail)
      fullName
      ...SpeakerLink
    }
  }
`)

export function MostSearchedSpeakers(props: {
  speakers: FragmentType<typeof MostSearchedSpeakersFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const data = useFragment(MostSearchedSpeakersFragment, props.speakers)

  return (
    <div className="symbol-group">
      {data.getMostSearchedSpeakers.map((speaker) => (
        <SpeakerLink
          key={speaker.id}
          speaker={speaker}
          title={speaker.fullName}
          className="symbol symbol-45px rounded-circle bg-gray-500 overflow-hidden"
        >
          <img src={mediaUrl + speaker.avatar} alt={speaker.fullName} />
        </SpeakerLink>
      ))}
    </div>
  )
}
