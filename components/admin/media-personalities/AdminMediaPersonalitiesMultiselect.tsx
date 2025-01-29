'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo } from 'react'
import { Multiselect } from '@/components/admin/forms/Multiselect'
import { Control, type FieldValues, type Path } from 'react-hook-form'

const AdminMediaPersonalitiesSelectFragment = gql(`
  fragment AdminMediaPersonalitySelect on Query {
    mediaPersonalities {
      id
      name
    }
  }
`)

export function AdminMediaPersonalitiesMultiselect<
  T extends FieldValues,
>(props: {
  control: Control<T>
  name: Path<T>
  data: FragmentType<typeof AdminMediaPersonalitiesSelectFragment>
}) {
  const data = useFragment(AdminMediaPersonalitiesSelectFragment, props.data)

  const items = useMemo(() => {
    return (
      data.mediaPersonalities?.map((mediaPersonality) => ({
        value: mediaPersonality.id,
        label: mediaPersonality.name,
      })) ?? []
    )
  }, [data])

  return (
    <Multiselect
      placeholder="Vyberte moderátory"
      items={items}
      control={props.control}
      name={props.name}
    />
  )
}
