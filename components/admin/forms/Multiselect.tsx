'use client'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'

type Item = {
  label: string
  value: string
}

export function Multiselect<T extends FieldValues>(props: {
  control: Control<T>
  name: keyof T
  items: Item[]
  placeholder?: string
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
      control={props.control}
      name={props.name as any}
      render={({ field }) => (
        <>
          <Combobox
            as="div"
            value={field.value}
            onChange={(ids: string[] | null) => {
              setQuery('')
              field.onChange(ids)
            }}
            multiple
            name={field.name}
          >
            <div className="relative mt-2">
              <ComboboxInput<Array<Item['value']>>
                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => setQuery('')}
                displayValue={(selectedValues) =>
                  props.items
                    .filter((item) => selectedValues?.includes(item.value))
                    .map((item) => item.label)
                    .join(',  ')
                }
                defaultValue={field.value}
                placeholder={props.placeholder}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>

              {filteredItems.length > 0 && (
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredItems.map((person) => (
                    <ComboboxOption
                      key={person.value}
                      value={person.value}
                      className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
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
              )}
            </div>
          </Combobox>
        </>
      )}
    />
  )
}
