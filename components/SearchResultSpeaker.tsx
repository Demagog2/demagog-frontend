import { pluralize } from '@/libs/pluralize'
import React from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerLink } from './speaker/SpeakerLink'

export const SearchResultSpeakerFragment = gql(`
  fragment SearchResultSpeakerDetail on Speaker {
    id
    fullName
    avatar(size: detail)
    body {
      shortName
    }
    verifiedStatementsCount
    ...SpeakerLink
  }
`)

export function SearchResultSpeaker(props: {
  speaker: FragmentType<typeof SearchResultSpeakerFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  const speaker = useFragment(SearchResultSpeakerFragment, props.speaker)

  return (
    <div className="col s-speaker">
      <div className="h-100 d-flex flex-column justify-content-between align-items-center">
        <div className="w-100 p-5">
          <SpeakerLink speaker={speaker} className="d-block position-relative">
            <span className="symbol symbol-square symbol-circle">
              {speaker.avatar && (
                <img src={mediaUrl + speaker.avatar} alt={speaker.fullName} />
              )}
            </span>
            {speaker.body && (
              <div className="symbol-label d-flex align-items-center justify-content-center w-45px h-45px rounded-circle bg-dark">
                <span className="smallest text-white lh-1 text-center p-2">
                  {speaker.body.shortName}
                </span>
              </div>
            )}
          </SpeakerLink>
        </div>
        <div className=" text-center lh-1">
          <h3 className="fs-4 fw-bold mb-4">{speaker.fullName}</h3>
          <p className="fs-6 fw-bold mb-4">{/*<%= speaker.role %>*/}</p>
          <p className="fs-6">
            {`${speaker.verifiedStatementsCount} ${pluralize(
              speaker.verifiedStatementsCount,
              'výrok',
              'výroky',
              'výroků'
            )}`}
          </p>
        </div>
        <div className="text-center mt-4">
          <SpeakerLink speaker={speaker} className="btn outline h-40x">
            <span className="fs-7">Otevřít profil</span>
          </SpeakerLink>
        </div>
      </div>
    </div>
  )
}
