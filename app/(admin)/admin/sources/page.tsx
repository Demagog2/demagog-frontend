import { gql } from '@/__generated__'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
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
import { PropsWithSearchParams } from '@/libs/params'

export const metadata: Metadata = {
  title: getMetadataTitle('Seznam diskuzí', 'Administrace'),
}

export default async function AdminSources(props: PropsWithSearchParams) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const before: string | null = null
  const after: string | null = null
  const term: string | null = null

  const { data } = await serverQuery({
    query: gql(`
      query AdminSources($after: String, $before: String, $term: String) {
        sourcesV2(first: 15, after: $after, before: $before, filter: { includeOnesWithoutPublishedStatements: true, name: $term }) {
          edges {
            node {
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
          pageInfo {
            hasPreviousPage
            hasNextPage
            endCursor
            startCursor
          }
        }
      }
    `),
    variables: {
      ...(after ? { after } : {}),
      ...(before ? { before } : {}),
      ...(term ? { term } : {}),
    },
  })

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Diskuze"
          description="Seznam diskuzí s výroky politiků."
        />
      </AdminPageHeader>
      <AdminPageContent>
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col" className="max-w-[200px]">
                Editoří
              </th>
              <th scope="col">Výroky</th>
              <th scope="col">
                <span className="sr-only">Akce</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.sourcesV2.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              const source = edge.node

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
                  <td>
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
                            className="hover:underline"
                            href={source.sourceUrl}
                          >
                            odkaz
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="max-w-[200px]">
                    <div className="flex -space-x-0.5">
                      <dt className="sr-only">Řečníci</dt>
                      {source.experts?.map((expert) => {
                        // TODO: Show avatar placeholder like in UserMenu

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
                  <td>
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
                            <span className="text-gray-500"> / </span>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </td>
                  <td>
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
      </AdminPageContent>
    </AdminPage>
  )
}
