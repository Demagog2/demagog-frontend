'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo } from 'react'
import { Controller } from 'react-hook-form'

const AdminVeracitySelectFragment = gql(`
  fragment AdminVeracitySelect on Query {
     veracities {
      id
      name
    }
  }
`)

export function AdminVeracitySelect(props: {
  control: any
  name: string
  data: FragmentType<typeof AdminVeracitySelectFragment>
  disabled?: boolean
  onChange(veracityId: string): void
}) {
  const { onChange } = props

  const data = useFragment(AdminVeracitySelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.veracities.map((veracity) => ({
        value: veracity.id,
        label: veracity.name,
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
            onChange={(item) => {
              if (!item) {
                return
              }

              onChange(item.value)
              field.onChange(item.value)
            }}
            defaultValue={field.value}
            placeholder="Vyberte hodnocení"
          />
        </>
      )}
    />
  )
}
