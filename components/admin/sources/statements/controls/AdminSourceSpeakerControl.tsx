'use client'

import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { AdminSourceSpeakerSelect } from '../AdminSourceSpeakerSelect'
import { type FragmentType, useFragment, gql } from '@/__generated__'

const AdminSourceSpeakerControlFragment = gql(`
  fragment AdminSourceSpeakerControl on Source {
    ...AdminSourceSpeakerSelect
  }
`)

export function AdminSourceSpeakerControl<T extends FieldValues>(props: {
  control: Control<T>
  name: Path<T>
  data: FragmentType<typeof AdminSourceSpeakerControlFragment>
  disabled: boolean
  onChange?(): void
}) {
  const data = useFragment(AdminSourceSpeakerControlFragment, props.data)

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <>
          <input type="hidden" {...field} />
          <AdminSourceSpeakerSelect
            disabled={props.disabled}
            id={field.name}
            data={data}
            onChange={(id) => {
              field.onChange(id)
              props.onChange?.()
            }}
            defaultValue={field.value}
          />
        </>
      )}
    />
  )
}
