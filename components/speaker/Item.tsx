import { SpeakerLink } from './SpeakerLink'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const SpeakerItemFragment = gql(`
  fragment SpeakerItemDetail on Speaker {
    id
    fullName
    avatar(size: detail)
    body {
      shortName
    }
    role
    ...SpeakerLink
  }
`)

export default function SpeakerItem(props: {
  speaker: FragmentType<typeof SpeakerItemFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  const speaker = useFragment(SpeakerItemFragment, props.speaker)

  return (
    <div className="col s-speaker">
      <div className="h-100 d-flex flex-column justify-content-between align-items-center">
        <div className="w-100 p-5">
          <SpeakerLink speaker={speaker} className="d-block position-relative">
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
          </SpeakerLink>
        </div>
        <div className="text-center lh-1">
          <h3 className="fs-4 fw-bold mb-4">{speaker.fullName}</h3>
          <div className="mb-4">
            <span className="fs-6 fw-bold">{speaker.role}</span>
          </div>
          <div className="text-center mt-4">
            <SpeakerLink speaker={speaker} className="btn outline h-40x fs-7">
              Otevřít profil
            </SpeakerLink>
          </div>
        </div>
      </div>
    </div>
  )
}
