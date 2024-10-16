import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminSourceStatementStep } from './AdminSourceStatementStep'
import { VeracityBadge } from '../veracity/VeracityBadge'
import { IStatementViewModel } from '@/libs/sources/presenters/SourceDetailPresenter'
import { AdminUserAvatar } from '../users/AdminUserAvatar'

const SourceStatementsFragment = gql(`
  fragment SourceStatements on Source {
    statements(includeUnpublished: true) {
      id
      title
      commentsCount
      content
      sourceSpeaker {
        fullName
        speaker {
          avatar
        }
      }
      assessment {
        ...VeracityBadge
        evaluator {
          avatar(size: small)
          fullName
        }
      }
      ...SourceStatementStep
    }
  }
`)

export function AdminSourceStatements(props: {
  source: FragmentType<typeof SourceStatementsFragment>
  filteredStatementsIds: string[]
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  const source = useFragment(SourceStatementsFragment, props.source)

  return (
    <>
      {/* Products */}
      <section aria-labelledby="products-heading" className="mt-6">
        <h2 id="products-heading" className="sr-only">
          Výroky diskuze
        </h2>

        <div className="space-y-8">
          {source.statements
            .filter((statement) =>
              props.filteredStatementsIds.includes(statement.id)
            )
            .map((statement, i) => (
              <div
                key={statement.id}
                className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
              >
                <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                  <div className="sm:flex lg:col-span-12">
                    <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                      {statement.sourceSpeaker.speaker.avatar && (
                        <img
                          alt={statement.sourceSpeaker.fullName}
                          src={
                            mediaUrl + statement.sourceSpeaker.speaker.avatar
                          }
                          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                      )}
                    </div>

                    <div className="mt-6 sm:ml-6 sm:mt-0">
                      <h3 className="text-base font-medium text-gray-900">
                        <a href={statement.id}>
                          {statement.sourceSpeaker.fullName}
                        </a>
                      </h3>

                      <VeracityBadge
                        className="mt-3"
                        assessment={statement.assessment}
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        &bdquo;{statement.content}&bdquo;
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 lg:col-span-5">
                    <dl className="grid grid-cols-2 gap-x-6 text-sm">
                      <div>
                        <dt className="font-medium text-gray-900">
                          Ověřovatel
                        </dt>
                        <dd className="mt-3 text-gray-500 lg:flex lg:items-center">
                          {!statement.assessment.evaluator?.fullName ? (
                            <span className="block">
                              Výrok nemá ověřovatele
                            </span>
                          ) : (
                            <>
                              <span className="block lg:mr-2">
                                <AdminUserAvatar
                                  fullName={
                                    statement.assessment.evaluator.fullName
                                  }
                                  avatar={statement.assessment.evaluator.avatar}
                                />
                              </span>
                              <span className="block mt-3 lg:mt-0">
                                {statement.assessment.evaluator?.fullName}
                              </span>
                            </>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">Komentáře</dt>
                        <dd className="mt-3 space-y-3 text-gray-500">
                          <p>Počet komentářů: {statement.commentsCount}</p>
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Upravit
                          </button>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <AdminSourceStatementStep statement={statement} step={i % 5} />
              </div>
            ))}
        </div>
      </section>
    </>
  )
}
