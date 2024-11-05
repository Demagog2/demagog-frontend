import { gql, FragmentType, useFragment } from '@/__generated__'
import { VeracityBadge } from '../../veracity/VeracityBadge'
import classNames from 'classnames'

const AdminStatementFragment = gql(`
  fragment AdminStatement on Statement {
    id
    content
    sourceSpeaker {
      speaker {
        avatar(size: detail)
      }
      fullName
    }
    tags {
      id
      name
    }
    assessment {
      ...VeracityBadge
      shortExplanation
    }
  }
`)

export function AdminStatement(props: {
  className?: string
  statement: FragmentType<typeof AdminStatementFragment>
}) {
  const statement = useFragment(AdminStatementFragment, props.statement)
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  return (
    <div className="flex p-4">
      <div className={classNames('mr-4 flex-shrink-0', props.className)}>
        <div className="flex items-center justify-center flex-col">
          <div>
            {statement.sourceSpeaker.speaker.avatar ? (
              <img
                alt={statement.sourceSpeaker.fullName}
                src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                className="inline-block h-9 w-9 rounded-full"
              />
            ) : (
              <span className="inline-block h-9 w-9 overflow-hidden rounded-full bg-gray-100">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full text-gray-300"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {statement.sourceSpeaker.fullName}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-base italic text-gray-600">
          &bdquo;{statement.content}&rdquo;
        </p>

        <VeracityBadge assessment={statement.assessment} />

        <p className="text-sm text-gray-500">
          {statement.assessment?.shortExplanation}
        </p>
      </div>
    </div>
  )
}
