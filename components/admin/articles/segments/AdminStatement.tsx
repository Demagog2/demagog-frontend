import { gql, FragmentType, useFragment } from '@/__generated__'
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
      veracity {
        key
        name
      }
      shortExplanation
    }
  }
`)

export function AdminStatement(props: {
  statement: FragmentType<typeof AdminStatementFragment>
}) {
  const statement = useFragment(AdminStatementFragment, props.statement)
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  return (
    <div className="flex p-4">
      <div className="mr-4 flex-shrink-0">
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
      <div>
        <p className="mt-1 text-base italic text-gray-600">
          &bdquo;{statement.content}&rdquo;
        </p>
        <span
          className={classNames(
            'mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
            {
              'bg-green-100 text-green-700':
                statement.assessment.veracity?.key === 'true',
              'bg-red-100 text-red-700':
                statement.assessment.veracity?.key === 'untrue',
              'bg-yellow-100 text-yellow-800':
                statement.assessment.veracity?.key === 'misleading',
              'bg-gray-100 text-gray-600':
                statement.assessment.veracity?.key === 'unverifiable',
            }
          )}
        >
          {statement.assessment?.veracity?.name}
        </span>
        <p className="mt-1 text-sm text-gray-500">
          {statement.assessment?.shortExplanation}
        </p>
      </div>
    </div>
  )
}
