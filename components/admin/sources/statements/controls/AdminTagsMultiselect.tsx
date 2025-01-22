'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo } from 'react'
import { Multiselect } from '@/components/admin/forms/Multiselect'
import { Control, FieldValues } from 'react-hook-form'

const AdminStatementTagsMultiselectFragment = gql(`
  fragment AdminStatementTags on Query {
   	tagsV2(first: 200) {
      nodes {
        id
        name
        forStatementType
      }
    }
  }
`)

const AdminStatementTagsStatementFragment = gql(`
  fragment AdminStatementForTags on Statement {
   	statementType
  }
`)

export function AdminStatementTagsMultiselect<T extends FieldValues>(props: {
  control: Control<T>
  name: keyof T
  data: FragmentType<typeof AdminStatementTagsMultiselectFragment>
  statement: FragmentType<typeof AdminStatementTagsStatementFragment>
  onChange(): void
  disabled?: boolean
}) {
  const data = useFragment(AdminStatementTagsMultiselectFragment, props.data)
  const statement = useFragment(
    AdminStatementTagsStatementFragment,
    props.statement
  )

  const items = useMemo(() => {
    return (
      data.tagsV2.nodes?.flatMap((tag) =>
        tag && tag.forStatementType === statement.statementType
          ? [
              {
                value: tag.id,
                label: tag.name,
              },
            ]
          : []
      ) ?? []
    )
  }, [data, statement.statementType])

  return (
    <Multiselect
      placeholder="Vyberte štítky"
      items={items}
      control={props.control}
      name={props.name}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  )
}
