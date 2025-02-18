'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useCallback, useMemo } from 'react'

const AdminSpeakerSelectFragment = gql(`
  fragment AdminSpeakerSelect on Query {
    speakers(limit: 10000) {
      id
      firstName
      lastName
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

type SelectedValue = {
  id: string
  firstName: string
  lastName: string
  avatar?: string
  role?: string
  bodyId?: string
}

export function AdminSpeakerSelect(props: {
  data: FragmentType<typeof AdminSpeakerSelectFragment>
  onChange: (id: SelectedValue) => void
}) {
  const { onChange } = props

  const data = useFragment(AdminSpeakerSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.speakers?.map((speaker) => ({
        value: {
          id: speaker.id,
          firstName: speaker.firstName,
          lastName: speaker.lastName,
          avatar: speaker.avatar ?? undefined,
          role: speaker.role ?? '',
          bodyId: speaker.body?.id ?? '',
        },
        label: speaker.fullName,
      })) ?? []
    )
  }, [data])

  const handleChange = useCallback(
    (item: { value: SelectedValue } | null) => item && onChange(item.value),
    [onChange]
  )

  return (
    <Select<SelectedValue>
      items={items}
      onChange={handleChange}
      placeholder="Přídat řečníka"
    />
  )
}
