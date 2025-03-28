'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useCallback, useMemo } from 'react'

const AdminExpertSelectFragment = gql(`
  fragment AdminExpertSelect on Query {
    users(limit: 200) {
      id
      fullName
    }
  }
`)

export function AdminEvaluatorSelector(props: {
  id?: string
  data: FragmentType<typeof AdminExpertSelectFragment>
  defaultValue?: string
  disabled?: boolean
  onChange: (id: string) => void
}) {
  const { onChange } = props

  const data = useFragment(AdminExpertSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.users?.map((body) => ({
        value: body.id,
        label: body.fullName,
      })) ?? []
    )
  }, [data])

  const handleChange = useCallback(
    (item: { value: string } | null) => onChange(item?.value ?? ''),
    [onChange]
  )

  return (
    <Select
      id={props.id}
      items={items}
      onChange={handleChange}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      canRemoveItem
      placeholder="Vyberte ověřovatele"
    />
  )
}
