'use client'

import { gql } from '@/__generated__'
import { useQuery } from '@apollo/client'
import formatDate from '@/libs/format-date'
import { Button } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

export function AdminSourceSegmentSelector(props: {
  onRemoveSegment?(): void
  onChange?(sourceId: string): void
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const { data } = useQuery(
    gql(`
      query AdminSourceSegmentSelector($name: String, $offset: Int, $limit: Int) {
        sources(
          name: $name
          offset: $offset
          limit: $limit
          includeOnesWithoutPublishedStatements: true
        ) {
          id
          name
          sourceUrl
          releasedAt
          medium {
            id
            name
          }
          sourceSpeakers {
            id
            fullName
            speaker {
              avatar
            }
          }
        }
      }
    `)
  )

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Vyberte diskuzi
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Vyberte ze seznamu diskuzi s výroky, které budou zobrazeny v článku.
        </p>
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {data?.sources.map((source) => (
          <li
            key={source.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-5 sm:px-6 hover:bg-gray-50 sm:flex-nowrap"
          >
            <div>
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={source.id} className="hover:underline">
                  {source.name}
                </a>
              </p>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p>
                  <a
                    href={source.sourceUrl ?? undefined}
                    className="hover:underline"
                  >
                    {source.medium?.name}
                  </a>
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p>
                  {source.releasedAt && (
                    <time dateTime={source.releasedAt}>
                      {formatDate(source.releasedAt)}
                    </time>
                  )}
                </p>
              </div>
            </div>
            <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
              <div className="flex -space-x-0.5">
                <dt className="sr-only">Řečníci</dt>
                {source.sourceSpeakers?.map((sourceSpeaker) => {
                  if (!sourceSpeaker?.speaker.avatar) {
                    return null
                  }

                  return (
                    <dd key={sourceSpeaker.id}>
                      <Image
                        width={24}
                        height={24}
                        alt={sourceSpeaker.fullName}
                        src={mediaUrl + sourceSpeaker.speaker.avatar}
                        className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white"
                      />
                    </dd>
                  )
                })}
              </div>
              <div className="flex w-16 gap-x-2.5">
                <dt>
                  <span className="sr-only">Potvrdit vyber</span>
                </dt>
                <dd className="text-sm leading-6 text-gray-900">
                  <button
                    type="button"
                    title="Potvrdit výběr"
                    className="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => props.onChange?.(source.id)}
                  >
                    <PlusIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div className="px-4 py-4 sm:px-6">
        <Button onClick={props.onRemoveSegment}>Odebrat</Button>
      </div>
    </div>
  )
}
