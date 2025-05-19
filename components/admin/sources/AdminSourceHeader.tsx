import { FragmentType, gql, useFragment } from '@/__generated__'
import { PencilIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import {
  getBetaAdminSourceStatsEnabled,
  getBetaAdminStatementBulkPublishingEnabled,
  getBetaAdminStatementReorderingEnabled,
} from '@/libs/flags'
import AdminSourceDeleteDialog from '@/components/admin/sources/AdminSourceDeleteDialog'
import { AdminSourceBulkPublishButton } from '@/components/admin/sources/AdminSourceBulkPublishButton'
import NewStatementDropdown from './statements/controls/NewStatementDropdown'
import { displayDate } from '@/libs/date-time'

const AdminSourceHeaderDataFragment = gql(`
  fragment AdminSourceHeaderData on Query {
    ...Authorization
  }
`)

const AdminSourceHeaderFragment = gql(`
  fragment AdminSourceHeader on Source {
    id
    name
    ...AdminSourceDelete
    medium {
      name
    }
    releasedAt
    sourceUrl
  }
`)

export async function AdminSourceHeader(props: {
  data: FragmentType<typeof AdminSourceHeaderDataFragment>
  source: FragmentType<typeof AdminSourceHeaderFragment>
}) {
  const data = useFragment(AdminSourceHeaderDataFragment, props.data)
  const source = useFragment(AdminSourceHeaderFragment, props.source)

  const { isAuthorized } = useAuthorization(data)

  const isBetaAdminStatementReorderingEnabled =
    await getBetaAdminStatementReorderingEnabled()

  const isBetaAdminStatementBulkPublishingEnabled =
    await getBetaAdminStatementBulkPublishingEnabled()

  const isBetaAdminSourceStatsEnabled = await getBetaAdminSourceStatsEnabled()

  return (
    <div>
      <div className="min-w-0 flex-1 px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <a
                  href="/beta/admin/sources"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Diskuze
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {source.name}
        </h2>
        <p className="mt-1 text-sm text-gray-700">
          {source.medium?.name}

          {source.releasedAt && (
            <> ze dne {displayDate(source.releasedAt ?? '')}</>
          )}

          {source.sourceUrl && (
            <>
              ,{' '}
              <a
                href={source.sourceUrl ?? ''}
                target="_blank"
                className="text-indigo-600 hover:underline"
              >
                odkaz
              </a>
            </>
          )}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="mt-5 flex space-x-2  px-4 sm:px-6 lg:px-8">
          {isAuthorized(['statements:add']) && (
            <NewStatementDropdown sourceId={source.id} />
          )}

          {isBetaAdminSourceStatsEnabled && (
            <a
              href={`/beta/admin/sources/${source.id}/stats`}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Statistiky
            </a>
          )}

          {isBetaAdminStatementReorderingEnabled &&
            isAuthorized(['statements:sort']) && (
              <a
                href={`/beta/admin/sources/${source.id}/statements/reorder`}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Seřadit výroky
              </a>
            )}

          {isAuthorized(['statements:edit']) && (
            <a
              href={`/beta/admin/sources/${source.id}/statements-video-marks`}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Propojení s videozáznamem
            </a>
          )}

          {isBetaAdminStatementBulkPublishingEnabled &&
            isAuthorized(['statements:edit']) && (
              <AdminSourceBulkPublishButton sourceId={source.id} />
            )}
        </div>
        <div className="mt-5 flex space-x-2  px-4 sm:px-6 lg:px-8">
          {isAuthorized(['sources:edit']) && (
            <AdminSourceDeleteDialog source={source} />
          )}

          <span className="hidden sm:block">
            <a
              href={`/beta/admin/sources/${source.id}/edit`}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PencilIcon
                aria-hidden="true"
                className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              />
              Upravit
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}
