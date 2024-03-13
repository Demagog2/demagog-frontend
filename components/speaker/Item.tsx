import Link from 'next/link'
import gql from 'graphql-tag'

export const SpeakerItemFragment = gql`
  fragment SpeakerItemDetail on Speaker {
    id
    fullName
    avatar(size: detail)
    body {
      shortName
    }
    role
  }
`

export type SpeakerItemProps = {
  speaker: {
    id: string
    fullName: string
    avatar: string
    body: { shortName: string } | null
    role: string
  }
}

export default function SpeakerItem({ speaker }: SpeakerItemProps) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  return (
    <div className="col s-speaker">
      <div className="h-100 d-flex flex-column justify-content-between align-items-center">
        <div className="w-100 p-5">
          <Link
            href={'/politici/' + speaker.id}
            className="d-block position-relative"
          >
            <div className="symbol symbol-square symbol-circle bg-light">
              {speaker.avatar && (
                <img src={mediaUrl + speaker.avatar} alt={speaker.fullName} />
              )}
            </div>
            {speaker.body && (
              <div className="symbol-label d-flex align-items-center justify-content-center w-45px h-45px rounded-circle bg-dark">
                <span className="smallest text-white lh-1 text-center p-2">
                  {speaker.body.shortName}
                </span>
              </div>
            )}
          </Link>
        </div>
        <div className="text-center lh-1">
          <h3 className="fs-4 fw-bold mb-4">{speaker.fullName}</h3>
          <div className="mb-4">
            <span className="fs-6 fw-bold">{speaker.role}</span>
          </div>
          <div className="text-center mt-4">
            <Link
              href={'/politici/' + speaker.id}
              className="btn outline h-40x fs-7"
            >
              Otevřít profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
