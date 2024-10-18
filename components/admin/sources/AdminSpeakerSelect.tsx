'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useCallback, useMemo } from 'react'

const AdminSpeakerSelectFragment = gql(`
  fragment AdminSpeakerSelect on Query {
    speakers(limit: 10000) {
      id
      fullName
      body {
        id
        shortName
      }
      role
      avatar
    }
  }
`)

export function AdminSpeakerSelect(props: {
  data: FragmentType<typeof AdminSpeakerSelectFragment>
  onChange: (id: string) => void
}) {
  const { onChange } = props

  const data = useFragment(AdminSpeakerSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.speakers?.map((medium) => ({
        value: medium.id,
        label: medium.fullName,
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
      placeholder="Vyberte řečníky"
    />
  )
}
