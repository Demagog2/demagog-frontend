'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminStatement } from '@/components/admin/articles/segments/AdminStatement'

const AdminSourceSortableStatementFragment = gql(`
  fragment AdminSourceSortableStatement on Statement {
    id
    ...AdminStatement
  }
`)

export function AdminSourceSortableStatement(props: {
  statement: FragmentType<typeof AdminSourceSortableStatementFragment>
}) {
  const statement = useFragment(
    AdminSourceSortableStatementFragment,
    props.statement
  )

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: statement.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AdminStatement className="relative mt-8" statement={statement} />
    </div>
  )
}
