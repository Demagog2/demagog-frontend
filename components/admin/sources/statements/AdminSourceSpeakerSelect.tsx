'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useCallback, useMemo } from 'react'

const AdminSourceSpeakerSelectFragment = gql(`
  fragment AdminSourceSpeakerSelect on Source {
    sourceSpeakers {
      id
      fullName
    }
  }
`)

export function AdminSourceSpeakerSelect(props: {
  id?: string
  data: FragmentType<typeof AdminSourceSpeakerSelectFragment>
  defaultValue?: string
  disabled?: boolean
  onChange: (id: string) => void
}) {
  const { onChange } = props

  const data = useFragment(AdminSourceSpeakerSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.sourceSpeakers?.map((speaker) => ({
        value: speaker.id,
        label: speaker.fullName,
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
      disabled={props.disabled}
      defaultValue={props.defaultValue}
      placeholder="Vyberte řečníka"
    />
  )
}
