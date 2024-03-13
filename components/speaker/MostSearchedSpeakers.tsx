import Link from 'next/link'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const MostSearchedSpeakersFragment = gql(`
  fragment MostSearchedSpeakers on Query {
    getMostSearchedSpeakers {
      id
      avatar(size: detail)
      fullName
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
