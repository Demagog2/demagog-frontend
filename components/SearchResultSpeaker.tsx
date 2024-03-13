import { pluralize } from '@/libs/pluralize'
import React from 'react'
import Link from 'next/link'
import gql from 'graphql-tag'

export const SearchResultSpeakerFragment = gql`
  fragment SearchResultSpeakerDetail on Speaker {
    id
    fullName
    avatar(size: detail)
    body {
      shortName
    }
    verifiedStatementsCount
  }
`

export function SearchResultSpeaker(props: {
  speaker: {
    id: string
    fullName: string
    avatar: string
    body: { shortName: string }
    verifiedStatementsCount: number
  }
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  return (
    <div className="col s-speaker">
      <div className="h-100 d-flex flex-column justify-content-between align-items-center">
        <div className="w-100 p-5">
          <Link
            href={`/politici/${props.speaker.id}`}
            className="d-block position-relative"
          >
            <span className="symbol symbol-square symbol-circle">
              {props.speaker.avatar && (
                <img
                  src={mediaUrl + props.speaker.avatar}
                  alt={props.speaker.fullName}
                />
              )}
            </span>
            {props.speaker.body && (
              <div className="symbol-label d-flex align-items-center justify-content-center w-45px h-45px rounded-circle bg-dark">
                <span className="smallest text-white lh-1 text-center p-2">
                  {props.speaker.body.shortName}
                </span>
              </div>
            )}
          </Link>
        </div>
        <div className=" text-center lh-1">
          <h3 className="fs-4 fw-bold mb-4">{props.speaker.fullName}</h3>
          <p className="fs-6 fw-bold mb-4">{/*<%= speaker.role %>*/}</p>
          <p className="fs-6">
            {`${props.speaker.verifiedStatementsCount} ${pluralize(
              props.speaker.verifiedStatementsCount,
              'výrok',
              'výroky',
              'výroků'
            )}`}
          </p>
        </div>
        <div className="text-center mt-4">
          <Link
            href={`/politici/${props.speaker.id}`}
            className="btn outline h-40x"
          >
            <span className="fs-7">Otevřít profil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
