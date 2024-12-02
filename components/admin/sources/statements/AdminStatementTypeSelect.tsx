'use client'

import { Select } from '@/components/admin/forms/Select'
import { useCallback } from 'react'

const StatementTypes = [
  { value: 'factual', label: 'Faktický' },
  { value: 'promise', label: 'Slib' },
  { value: 'newyear', label: 'Silvestrovský' },
]

export function AdminStatementTypeSelect(props: {
  id?: string
  defaultValue?: string
  onChange: (id: string) => void
}) {
  const { onChange } = props

  const handleChange = useCallback(
    (item: { value: string } | null) => item && onChange(item.value),
    [onChange]
  )

  return (
    <Select
      id={props.id}
      items={StatementTypes}
      onChange={handleChange}
      defaultValue={props.defaultValue}
      placeholder="Vyberte typ výroku"
    />
  )
}
