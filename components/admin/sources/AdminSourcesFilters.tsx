'use client'

import { useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { SourceDetailPresenter } from '@/libs/sources/presenters/SourceDetailPresenter'
import { EMPTY_SOURCE, ISource } from '@/libs/sources/model/Source'
import { createSourceFromQuery } from '@/libs/sources/data-mappers/SourceDataMapper'
import { useStatementFilters } from '@/libs/sources/hooks/statement-filters'
import { AdminSourceStatements } from '@/components/admin/sources/AdminSourceStatements'

void gql(`
  fragment AdminSourcesFilterSegment on Statement {
    id
    content
    published
    commentsCount
    sourceSpeaker {
      id
      firstName
      lastName
      speaker {
        id
      }
    }
    assessment {
      id
      explanationCharactersLength
      shortExplanationCharactersLength
      assessmentMethodology {
        id
        ratingModel
        ratingKeys
      }
      evaluator {
        id
        firstName
        lastName
      }
      evaluationStatus
      veracity {
        id
        key
        name
      }
      promiseRating {
        id
        key
        name
      }
    }
  }
`)

const AdminSourcesFilterFragment = gql(`
  fragment AdminSourcesFilters on Source {
    ...SourceStatements
    id 
    name
    sourceUrl
    releasedAt
    sourceSpeakers {
      id
      firstName
      lastName
      role
      speaker {
        id
      }
      body {
        id
      }
    }
    medium {
      id
      name
    }
    mediaPersonalities {
      id
      name
    }
    experts {
      id
      firstName
      lastName
    }
    statements(includeUnpublished: true) {
      ...AdminSourcesFilterSegment
    }
  }
`)

const AdminSourceFiltersDataFragment = gql(`
  fragment AdminSourceFiltersData on Query {
    ...AdminSourceStatementsData
  }
`)

export function AdminSourcesFilters(props: {
  source: FragmentType<typeof AdminSourcesFilterFragment>
  statementsData: FragmentType<typeof AdminSourceFiltersDataFragment>
}) {
  const { state, onStatementsFilterUpdate, onRemoveStatementsFilters } =
    useStatementFilters()

  const data = useFragment(AdminSourcesFilterFragment, props.source)
  const statementsData = useFragment(
    AdminSourceFiltersDataFragment,
    props.statementsData
  )

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const source = useMemo<ISource>(
    () => (data ? createSourceFromQuery(data) : EMPTY_SOURCE),
    [data]
  )

  const sourceViewModel = new SourceDetailPresenter(
    source,
    state ? [state] : []
  ).buildViewModel()

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-8">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filtry</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Zavrit menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                <Button
                  className="text-sm text-gray-900 disabled:text-gray-500 mb-8 mt-4 px-4"
                  disabled={!sourceViewModel.hasActiveFilter}
                  onClick={onRemoveStatementsFilters}
                >
                  Všechny výroky ({sourceViewModel.statementsTotalCount})
                </Button>

                {sourceViewModel.filters.map((section) => {
                  if (section.type === 'filter') {
                    return (
                      <div key={section.key} className="flex items-center p-4">
                        <input
                          checked={section.active}
                          id={`mobile-${section.key}`}
                          name={section.key}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => onStatementsFilterUpdate(section.key)}
                        />
                        <label
                          htmlFor={`mobile-${section.key}`}
                          className="ml-3 text-sm text-gray-500"
                        >
                          {section.label}
                        </label>
                      </div>
                    )
                  }

                  return (
                    <Disclosure
                      key={section.label}
                      as="div"
                      className="border-t border-gray-200 pb-4 pt-4"
                    >
                      <fieldset>
                        <legend className="w-full px-2">
                          <DisclosureButton className="group flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                            <span className="text-sm font-medium text-gray-900">
                              {section.label}
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="h-5 w-5 rotate-0 transform group-data-[open]:-rotate-180"
                              />
                            </span>
                          </DisclosureButton>
                        </legend>
                        <DisclosurePanel className="px-4 pb-2 pt-4">
                          <div className="space-y-6">
                            {section.filters.map((option) => (
                              <div
                                key={option.key}
                                className="flex items-center"
                              >
                                <input
                                  checked={option.active}
                                  id={`mobile-${option.key}`}
                                  name={option.key}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={() =>
                                    onStatementsFilterUpdate(option.key)
                                  }
                                />
                                <label
                                  htmlFor={`mobile-${option.key}`}
                                  className="ml-3 text-sm text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </fieldset>
                    </Disclosure>
                  )
                })}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
          <aside>
            <h2 className="sr-only">Filtry</h2>

            <Button
              className="hidden lg:block text-sm text-gray-900 disabled:text-gray-500 mb-8"
              disabled={!sourceViewModel.hasActiveFilter}
              onClick={onRemoveStatementsFilters}
            >
              Všechny výroky ({sourceViewModel.statementsTotalCount})
            </Button>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center lg:hidden"
            >
              <span className="text-sm font-medium text-gray-700">Filters</span>
              <PlusIcon
                aria-hidden="true"
                className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
              />
            </button>

            <div className="hidden lg:block">
              <form className="space-y-10 divide-y divide-gray-200">
                {sourceViewModel.filters.map((section, sectionIdx) => {
                  if (section.type !== 'filter-group') {
                    return (
                      <div key={section.key} className="flex items-center pt-6">
                        <input
                          checked={section.active}
                          id={section.key}
                          name={section.key}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => onStatementsFilterUpdate(section.key)}
                        />
                        <label
                          htmlFor={section.key}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {section.label}
                        </label>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={section.label}
                      className={sectionIdx === 0 ? undefined : 'pt-10'}
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {section.label}
                        </legend>
                        <div className="space-y-3 pt-6">
                          {section.filters.map((option) => (
                            <div key={option.key} className="flex items-center">
                              <input
                                checked={option.active}
                                id={option.key}
                                name={option.key}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() =>
                                  onStatementsFilterUpdate(option.key)
                                }
                              />
                              <label
                                htmlFor={option.key}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )
                })}
              </form>

              <div className="mt-10 space-y-8">
                {sourceViewModel.speakerStats.map((speakerStats) => {
                  return (
                    <div
                      key={speakerStats.id}
                      className="lg:col-start-3 lg:row-end-1"
                    >
                      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 p-6">
                        <h3 className="text-base font-medium text-gray-900">
                          {speakerStats.title}
                        </h3>

                        <div>
                          <ul className="mt-4 space-y-2">
                            {speakerStats.stats.map((stat) => (
                              <li key={stat} className="text-sm text-gray-600">
                                {stat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
            <AdminSourceStatements
              data={statementsData}
              source={data}
              filteredStatementsIds={sourceViewModel.filteredStatements.map(
                (statement) => statement.id
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
