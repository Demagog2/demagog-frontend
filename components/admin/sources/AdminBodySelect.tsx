'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useCallback, useMemo } from 'react'

const AdminBodySelectFragment = gql(`
  fragment AdminBodySelect on Query {
    bodies(limit: 1000) {
      id
      name
      shortName
      isInactive
      terminatedAt
    }
  }
`)

export function AdminBodySelect(props: {
  id?: string
  data: FragmentType<typeof AdminBodySelectFragment>
  defaultValue?: string
  onChange: (id: string) => void
}) {
  const { onChange } = props

  const data = useFragment(AdminBodySelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.bodies?.map((body) => ({
        value: body.id,
        label: body.name,
      })) ?? []
    )
  }, [data])

  const handleChange = useCallback(
    (item: { value: string } | null) => item && onChange(item.value),
    [onChange]
  )

  return (
    <Select
      id={props.id}
      items={items}
      onChange={handleChange}
      defaultValue={props.defaultValue}
      placeholder="Vyberte stranu"
    />
  )
}
