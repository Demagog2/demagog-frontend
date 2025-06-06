'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo } from 'react'
import { Multiselect } from '@/components/admin/forms/Multiselect'
import { Control, type FieldValues, type Path } from 'react-hook-form'

const AdminStatementArticleTagsMultiselectFragment = gql(`
  fragment AdminStatementArticleTags on Query {
    articleTags(limit: 10000) {
      id
      title
    }
  }
`)

export function AdminStatementArticleTagsMultiselect<
  T extends FieldValues,
>(props: {
  control: Control<T>
  name: Path<T>
  data: FragmentType<typeof AdminStatementArticleTagsMultiselectFragment>
  disabled?: boolean
  onChange?(): void
}) {
  const data = useFragment(
    AdminStatementArticleTagsMultiselectFragment,
    props.data
  )

  const items = useMemo(() => {
    return (
      data.articleTags.flatMap((tag) =>
        tag
          ? [
              {
                value: tag.id,
                label: tag.title ?? '',
              },
            ]
          : []
      ) ?? []
    )
  }, [data])

  return (
    <Multiselect
      placeholder="Vyberte tagy"
      items={items}
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  )
}
