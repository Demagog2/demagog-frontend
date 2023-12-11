import gql from 'graphql-tag'
import Link from 'next/link'

export const MostSearchedSpeakerFragment = gql`
  fragment MostSearchedSpeakerDetail on Speaker {
    id
    avatar
    fullName
  }
`

export function MostSearchedSpeakers(props: {
  speakers: {
    id: string
    avatar: string
    fullName: string
  }[]
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  return (
    <div className="symbol-group">
      {props.speakers.map((speaker) => (
        <Link
          key={speaker.id}
          href={`/politici/${speaker.id}`}
          title={speaker.fullName}
          className="symbol symbol-45px rounded-circle bg-gray-500 overflow-hidden"
        >
          <img src={mediaUrl + speaker.avatar} alt={speaker.fullName} />
        </Link>
      ))}
    </div>
  )
}
