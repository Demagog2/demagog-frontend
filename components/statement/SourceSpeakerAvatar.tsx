import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerLink } from '../speaker/SpeakerLink'
import Image from 'next/image'
import { imagePath } from '@/libs/images/path'
import classNames from 'classnames'

const SourceSpeakerAvatarFragment = gql(`
  fragment SourceSpeakerAvatar on Statement {
    sourceSpeaker {
      fullName
      role
      speaker {
        avatar(size: detail)
        ...SpeakerLink
      }
      body {
        shortName
      }
    }
  }
`)

export function SourceSpeakerAvatar(props: {
  statement: FragmentType<typeof SourceSpeakerAvatarFragment>
  isEmbedded?: boolean
  isRole?: boolean
}) {
  const statement = useFragment(SourceSpeakerAvatarFragment, props.statement)

  return (
    <>
      <SpeakerLink
        speaker={statement.sourceSpeaker?.speaker}
        className="d-block position-relative"
      >
        <span
          className={classNames('symbol symbol-square symbol-circle', {
            'w-60px h-60px w-md-80px h-md-80px': props.isEmbedded,
          })}
        >
          {statement.sourceSpeaker.speaker.avatar && (
            <Image
              src={imagePath(statement.sourceSpeaker.speaker.avatar)}
              alt={statement.sourceSpeaker.fullName}
              width={85}
              height={85}
            />
          )}
        </span>
        {props.isEmbedded && statement.sourceSpeaker.body?.shortName && (
          <div className="symbol-label d-flex align-items-center justify-content-center w-35px h-35px rounded-circle bg-dark">
            <span className="smallest text-white lh-1 text-center p-2">
              {statement.sourceSpeaker.body.shortName}
            </span>
          </div>
        )}
      </SpeakerLink>
      <div className="mt-2 text-center w-100">
        <h3 className="fs-6 fw-bold">{statement.sourceSpeaker.fullName}</h3>
        {props.isRole && (
          <h3 className="fs-6 fw-bold fst-italic">
            {statement.sourceSpeaker.role}
          </h3>
        )}
      </div>
    </>
  )
}
