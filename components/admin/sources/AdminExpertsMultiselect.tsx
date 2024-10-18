'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo } from 'react'
import { Multiselect } from '@/components/admin/forms/Multiselect'
import { Control, FieldValues } from 'react-hook-form'

const AdminExpertsMultiselectFragment = gql(`
  fragment AdminExpertsSelect on Query {
    users(limit: 200, roles: ["expert", "admin"]) {
      id
      fullName
    }
  }
`)

export function AdminExpertsMultiselect<T extends FieldValues>(props: {
  control: Control<T>
  name: keyof T
  data: FragmentType<typeof AdminExpertsMultiselectFragment>
}) {
  const data = useFragment(AdminExpertsMultiselectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.users?.map((user) => ({
        value: user.id,
        label: user.fullName,
      })) ?? []
    )
  }, [data])

  return (
    <Multiselect
      placeholder="Vyberte editory"
      items={items}
      control={props.control}
      name={props.name}
    />
  )
}
