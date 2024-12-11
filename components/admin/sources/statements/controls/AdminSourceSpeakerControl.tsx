'use client'

import { Control, Controller, FieldValues } from 'react-hook-form'
import { AdminSourceSpeakerSelect } from '../AdminSourceSpeakerSelect'
import { FragmentType, useFragment, gql } from '@/__generated__'

const AdminSourceSpeakerControlFragment = gql(`
  fragment AdminSourceSpeakerControl on Source {
    ...AdminSourceSpeakerSelect
  }
`)

export function AdminSourceSpeakerControl<T extends FieldValues>(props: {
  control: Control<T>
  name: keyof T
  data: FragmentType<typeof AdminSourceSpeakerControlFragment>
  disabled: boolean
}) {
  const data = useFragment(AdminSourceSpeakerControlFragment, props.data)

  return (
    <Controller
      control={props.control}
      name={props.name as any}
      render={({ field }) => (
        <>
          <input type="hidden" {...field} />
          <AdminSourceSpeakerSelect
            disabled={props.disabled}
            id={field.name}
            data={data}
            onChange={field.onChange}
            defaultValue={field.value}
          />
        </>
      )}
    />
  )
}
