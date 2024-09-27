import { gql } from '@/__generated__'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import { displayDate } from '@/libs/date-time'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_LABELS,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '@/libs/constants/assessment'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam diskuzí', 'Administrace'),
}

export default async function AdminSources() {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const { data } = await serverQuery({
    query: gql(`
      query AdminSources {
        sources {
          id
          name
          releasedAt
          sourceUrl
          experts {
            id
            fullName
            avatar(size: small)
          }
          medium {
            name
          }
          mediaPersonalities {
            name
          }
          statementsCountsByEvaluationStatus {
            evaluationStatus
            statementsCount
          }
        }
      }
    `),
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="pb-5 sm:flex sm:items-center sm:justify-between">
        <AdminPageTitle
          title="Diskuze"
          description="Seznam diskuzí s výroky politiků."
        />
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Název
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-[200px]"
                  >
                    Editoří
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Výroky
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Akce</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.sources.map((source) => {
                  const statementsCountsMap: Record<string, number> =
                    source.statementsCountsByEvaluationStatus.reduce(
                      (carry, item) => {
                        return {
                          ...carry,
                          [item.evaluationStatus]: item.statementsCount,
                        }
                      },
                      {
                        [ASSESSMENT_STATUS_BEING_EVALUATED]: 0,
                        [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 0,
                        [ASSESSMENT_STATUS_PROOFREADING_NEEDED]: 0,
                        [ASSESSMENT_STATUS_APPROVED]: 0,
                      }
                    )

                  return (
                    <tr key={source.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <Link href={`/admin/sources/${source.id}`}>
                          {source.name}
                        </Link>

                        <div className="text-sm text-gray-500 font-normal">
                          {source.medium?.name} ze dne{' '}
                          {source.releasedAt
                            ? displayDate(source.releasedAt)
                            : 'neuvedeno'}
                          {source.mediaPersonalities &&
                            source.mediaPersonalities.length > 0 && (
                              <>
                                ,{' '}
                                {source.mediaPersonalities
                                  ?.map((p) => p.name)
                                  .join(' & ')}
                              </>
                            )}
                          {source.sourceUrl && (
                            <>
                              ,{' '}
                              <Link
                                className={'underline'}
                                href={source.sourceUrl}
                              >
                                odkaz
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-[200px]">
                        <div className="flex -space-x-0.5">
                          <dt className="sr-only">Řečníci</dt>
                          {source.experts?.map((expert) => {
                            if (!expert?.avatar) {
                              return null
                            }

                            return (
                              <span key={expert.id}>
                                <Image
                                  width={24}
                                  height={24}
                                  alt={expert.fullName}
                                  src={mediaUrl + expert.avatar}
                                  className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white"
                                  title={expert.fullName}
                                />
                              </span>
                            )
                          })}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {Object.keys(statementsCountsMap).map(
                          (evaluationStatus, index, { length }) => (
                            <React.Fragment key={evaluationStatus}>
                              <span
                                style={{
                                  fontWeight:
                                    statementsCountsMap[evaluationStatus] > 0
                                      ? 'bold'
                                      : 'normal',
                                }}
                                title={
                                  ASSESSMENT_STATUS_LABELS[
                                    evaluationStatus as keyof typeof ASSESSMENT_STATUS_LABELS
                                  ]
                                }
                              >
                                {statementsCountsMap[evaluationStatus]}
                              </span>

                              {index < length - 1 && (
                                <span className={'text-gray-500'}> / </span>
                              )}
                            </React.Fragment>
                          )
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <Link
                          href={`/admin/sources/${source.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Detail
                        </Link>

                        {/* <AdminArticleDeleteDialog article={edge.node} /> */}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
