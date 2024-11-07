'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useCallback, useMemo } from 'react'

const AdminMediumSelectFragment = gql(`
  fragment AdminMediumSelect on Query {
    media {
      id
      name
    }
  }
`)

export function AdminMediumSelect(props: {
  data: FragmentType<typeof AdminMediumSelectFragment>
  defaultValue?: string
  onChange: (id: string) => void
}) {
  const { onChange } = props

  const data = useFragment(AdminMediumSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.media?.map((medium) => ({
        value: medium.id,
        label: medium.name,
      })) ?? []
    )
  }, [data])

  const handleChange = useCallback(
    (item: { value: string } | null) => item && onChange(item.value),
    [onChange]
  )

  return (
    <Select
      items={items}
      onChange={handleChange}
      defaultValue={props.defaultValue}
      placeholder="Vyberte pořad"
    />
  )
}
