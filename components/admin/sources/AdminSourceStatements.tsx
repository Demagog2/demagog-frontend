import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminSourceStatementStep } from './AdminSourceStatementStep'
import { VeracityBadge } from '../veracity/VeracityBadge'
import { AdminUserAvatar } from '../users/AdminUserAvatar'
import { ASSESSMENT_STATUS_APPROVED } from '@/libs/constants/assessment'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { AdminStatementAssessmentStats } from './statements/AdminStatementAssessmentStats'
import AdminStatementDeleteDialog from './statements/AdminStatementDeleteDialog'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import { sortBy } from 'lodash'
import classNames from 'classnames'

const SourceStatementsFragment = gql(`
  fragment SourceStatements on Source {
    id
    statements(includeUnpublished: true) {
      id
      title
      commentsCount
      content
      sourceOrder
      sourceSpeaker {
        fullName
        speaker {
          id
          avatar
        }
      }
      ...AdminStatementDeleteDialog
      assessment {
        ...VeracityBadge
        evaluationStatus
        ...AdminStatementAssessmentStats
        evaluator {
          ...AdminUserAvatar
          fullName
        }
      }
      ...SourceStatementStep
    }
  }
`)

const AdminSourceStatementsDataFragment = gql(`
  fragment AdminSourceStatementsData on Query {
    ...Authorization
  }
`)

interface AdminSourceStatementsProps {
  source: FragmentType<typeof SourceStatementsFragment>
  data: FragmentType<typeof AdminSourceStatementsDataFragment>
  filteredStatementsIds: string[]
  isCondensed?: boolean
}

export function AdminSourceStatements({
  source: sourceFragment,
  data: dataFragment,
  filteredStatementsIds,
  isCondensed = false,
}: AdminSourceStatementsProps) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  const data = useFragment(AdminSourceStatementsDataFragment, dataFragment)
  const source = useFragment(SourceStatementsFragment, sourceFragment)

  const { isAuthorized } = useAuthorization(data)

  return (
    <>
      {/* Products */}
      <section aria-labelledby="products-heading" className="mt-6">
        <h2 id="products-heading" className="sr-only">
          Výroky diskuze
        </h2>

        <div className="space-y-8">
          {sortBy(source.statements, (statement) => statement.sourceOrder)
            .filter((statement) => filteredStatementsIds.includes(statement.id))
            .map((statement) => (
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

                    <div className="mt-6 sm:ml-6 sm:mt-0 w-full">
                      <div className="flex justify-between gap-2">
                        <h3 className="text-base font-medium text-gray-900 break-words flex-1">
                          <a
                            href={`/beta/admin/sources/${source.id}/statements/${statement.id}`}
                          >
                            {statement.sourceSpeaker.fullName}
                          </a>
                        </h3>{' '}
                        <div className="flex items-center justify-end flex-wrap">
                          <div className="inline-flex text-gray-400 hover:text-indigo-900">
                            <a
                              href={`/beta/admin/sources/${source.id}/statements/${statement.id}`}
                              className="inline-flex items-end"
                              title="Detail výroku"
                            >
                              <p className="text-sm text-right">
                                Na detail výroku
                              </p>
                              <ArrowTopRightOnSquareIcon className="h-7 w-7 ml-2 cursor-pointer shrink-0" />
                            </a>
                          </div>
                          {isAuthorized(['statements:edit']) && (
                            <AdminStatementDeleteDialog
                              statement={statement}
                              sourceId={source.id}
                            />
                          )}
                        </div>
                      </div>

                      {statement.assessment.evaluationStatus ===
                        ASSESSMENT_STATUS_APPROVED && (
                        <VeracityBadge
                          className="mt-3"
                          assessment={statement.assessment}
                        />
                      )}
                      {statement.content ? (
                        <a
                          href={`/beta/admin/sources/${source.id}/statements/${statement.id}`}
                        >
                          <p className="mt-3 text-sm text-gray-500">
                            &bdquo;{statement.content}&rdquo;
                          </p>
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 lg:col-span-5">
                    <dl
                      className={classNames('grid gap-x-6 text-sm', {
                        'grid-cols-1': isCondensed,
                        'grid-cols-2': !isCondensed,
                      })}
                    >
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
                                  user={statement.assessment.evaluator}
                                />
                              </span>
                              <span className="block mt-3 lg:mt-0">
                                {statement.assessment.evaluator?.fullName}
                              </span>
                            </>
                          )}
                        </dd>
                      </div>
                      {!isCondensed && (
                        <div>
                          <dt className="font-medium text-gray-900">
                            Komentáře
                          </dt>
                          <dd className="mt-3 space-y-3 text-gray-500">
                            <p>Počet komentářů: {statement.commentsCount}</p>
                          </dd>
                        </div>
                      )}
                    </dl>

                    {!isCondensed && (
                      <AdminStatementAssessmentStats
                        assessment={statement.assessment}
                      />
                    )}
                  </div>
                </div>
                {!isCondensed && (
                  <AdminSourceStatementStep statement={statement} />
                )}
              </div>
            ))}
        </div>
      </section>
    </>
  )
}
