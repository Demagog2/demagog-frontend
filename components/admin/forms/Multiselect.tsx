'use client'

import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { AdminBadge } from '@/components/admin/layout/AdminBadge'

type Item = {
  label: string
  value: string
}

export function Multiselect<T extends FieldValues>(props: {
  control: Control<T>
  name: keyof T
  items: Item[]
  placeholder?: string
  disabled?: boolean
}) {
  const [query, setQuery] = useState('')

  const filteredItems =
    query === ''
      ? props.items
      : props.items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <Controller
      disabled={props.disabled}
      control={props.control}
      name={props.name as any}
      render={({ field }) => {
        const selectedItems = props.items.filter((item) =>
          field.value.includes(item.value)
        )

        return (
          <>
            <Combobox
              as="div"
              value={field.value}
              onChange={(ids: string[] | null) => {
                setQuery('')
                field.onChange(ids)
              }}
              onClose={() => setQuery('')}
              multiple
              name={field.name}
              disabled={field.disabled}
            >
              <div className="relative mt-2">
                <ComboboxButton
                  as="div"
                  disabled={field.disabled}
                  className="w-full text-left space-x-2 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {!selectedItems.length ? (
                    <span className="text-gray-500 cursor-text">
                      {props.placeholder}
                    </span>
                  ) : (
                    <>
                      {selectedItems.map((item) => (
                        <AdminBadge
                          key={item.value}
                          className="bg-gray-100 text-gray-600"
                          onRemove={
                            props.disabled
                              ? undefined
                              : (evt) => {
                                  evt.stopPropagation()

                                  field.onChange(
                                    field.value.filter(
                                      (value: string) => value !== item.value
                                    )
                                  )
                                }
                          }
                        >
                          {item.label}
                        </AdminBadge>
                      ))}
                    </>
                  )}
                </ComboboxButton>

                <ComboboxButton
                  disabled={field.disabled}
                  className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
                >
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </ComboboxButton>

                <ComboboxOptions
                  transition
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm origin-top border transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <input
                    autoFocus
                    type="search"
                    className="w-full -mt-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) => setQuery(event.target.value)}
                    value={query}
                    placeholder={props.placeholder}
                  />

                  {!filteredItems.length && (
                    <div className="text-center mt-8 mb-8">
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        Nic nenalezeno
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {query.length ? (
                          <>
                            Pro výraz &quot;{query}&quot; nebylo nic nalezeno.
                          </>
                        ) : (
                          <>Nebyla nalezena žádná položka.</>
                        )}
                      </p>
                    </div>
                  )}

                  {filteredItems.map((person) => (
                    <ComboboxOption
                      key={person.value}
                      value={person.value}
                      className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                      disabled={field.disabled}
                    >
                      <span className="block truncate group-data-[selected]:font-semibold">
                        {person.label}
                      </span>

                      <span className="absolute inset-y-0 left-0 hidden items-center pl-1.5 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </div>
            </Combobox>
          </>
        )
      }}
    />
  )
}
