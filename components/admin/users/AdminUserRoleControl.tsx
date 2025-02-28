'use client'

import { Select } from '@/components/admin/forms/Select'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

const AdminUserRoleSelectFragment = gql(`
  fragment AdminUserRoleSelect on Query {
    roles {
      id
      name
    }
  }
`)

export function AdminUserRoleSelect<T extends FieldValues>(props: {
  id?: string
  control: Control<T>
  name: Path<T>
  data: FragmentType<typeof AdminUserRoleSelectFragment>
  defaultValue?: string
}) {
  const data = useFragment(AdminUserRoleSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.roles?.map((role) => ({
        value: role.id,
        label: role.name,
      })) ?? []
    )
  }, [data])

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <>
          <input type="hidden" {...field} />
          <Select
            id={props.id}
            items={items}
            onChange={(item) => field.onChange(item?.value)}
            defaultValue={field.value}
            placeholder="Vyberte..."
          />
        </>
      )}
    />
  )
}
