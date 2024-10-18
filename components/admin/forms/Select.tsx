'use client'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useCallback, useState } from 'react'

export type Item<T = string> = {
  label: string
  value: T
}

export function Select<T>(props: {
  id?: string
  items: Item<T>[]
  placeholder?: string
  onChange(item: Item<T>): void
}) {
  const { onChange } = props

  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item<T> | null>(null)

  const filteredItems =
    query === ''
      ? props.items
      : props.items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )

  const handleChange = useCallback(
    (item: Item<T>) => {
      setQuery('')
      onChange(item)
      setSelectedItem(item)
    },
    [onChange]
  )

  return (
    <Combobox
      id={props.id}
      as="div"
      value={selectedItem}
      onChange={handleChange}
    >
      <div className="relative mt-2">
        <ComboboxInput<Item>
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={(item) => item?.label}
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
            {filteredItems.map((person, i) => (
              <ComboboxOption
                key={i}
                value={person}
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
  )
}
