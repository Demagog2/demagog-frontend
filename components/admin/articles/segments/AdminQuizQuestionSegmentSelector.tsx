'use client'

import { gql } from '@/__generated__'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Button } from '@headlessui/react'
import { useQuery } from '@apollo/client'

export function AdminQuizQuestionSegmentSelector(props: {
  selectedQuizQuestionId?: string
  onRemoveSegment?(): void
  onChange?(quizQuestionId: string): void
}) {
  const { data } = useQuery(
    gql(`
      query AdminQuizQuestionSegmentSelector($filter: QuizQuestionsFilterInput) {
        quizQuestions(filter: $filter) {
          edges {
            node {
              id
              title
              description
              createdAt
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
          Vyberte kvízovou otázku
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Vyberte ze seznamu otázky, které budou zobrazeny v článku.
        </p>
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {data?.quizQuestions.edges?.map((edge) => {
          const node = edge?.node

          if (!node) {
            return null
          }
          return (
            <li
              key={node.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-5 sm:px-6 hover:bg-gray-50 sm:flex-nowrap"
            >
              <div>
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <a
                    href={`/beta/admin/education/${node.id}`}
                    className="hover:underline"
                  >
                    {node.title}
                  </a>
                </p>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p>{node.description}</p>
                </div>
              </div>
              <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
                <div className="flex w-16 gap-x-2.5">
                  <dt>
                    <span className="sr-only">Potvrdit vyber</span>
                  </dt>
                  <dd className="text-sm leading-6 text-gray-900">
                    <button
                      type="button"
                      title="Potvrdit výběr"
                      className="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => props.onChange?.(node.id)}
                    >
                      <PlusIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </dd>
                </div>
              </dl>
            </li>
          )
        })}
      </ul>
      <div className="px-4 py-4 sm:px-6">
        <Button onClick={props.onRemoveSegment}>Odebrat</Button>
      </div>
    </div>
  )
}
