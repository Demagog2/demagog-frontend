'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo } from 'react'
import { Controller } from 'react-hook-form'

const AdminPromiseRatingSelectFragment = gql(`
  fragment AdminPromiseRatingSelect on Query {
     promiseRatings {
      id
      key
      name
    }
  }
`)

export function AdminPromiseRatingSelect(props: {
  control: any
  name: string
  data: FragmentType<typeof AdminPromiseRatingSelectFragment>
  allowedKeys: string[]
  defaultValue?: string
  disabled?: boolean
}) {
  const data = useFragment(AdminPromiseRatingSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.promiseRatings
        ?.filter((promiseRating) =>
          props.allowedKeys.includes(promiseRating.key)
        )
        .map((promiseRating) => ({
          value: promiseRating.id,
          label: promiseRating.name,
        })) ?? []
    )
  }, [data])

  return (
    <Controller
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <>
          <input type="hidden" {...field} />
          <Select
            id={field.name}
            items={items}
            onChange={(item) => item && field.onChange(item.value)}
            defaultValue={field.value}
            placeholder="Vyberte hodnocení"
          />
        </>
      )}
    />
  )
}
