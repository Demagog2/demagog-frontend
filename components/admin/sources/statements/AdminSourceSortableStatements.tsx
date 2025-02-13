'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCallback, useState } from 'react'
import { sortBy } from 'lodash'
import { AdminSourceSortableStatement } from '@/components/admin/sources/statements/AdminSourceSortableStatement'
import { updateSourceStatementsOrder } from '@/app/(admin)/beta/admin/sources/[slug]/statements/reorder/actions'
import { toast } from 'react-toastify'

const AdminSourceSortableStatementsFragment = gql(`
  fragment AdminSourceSortableStatements on Source {
    id
    statements(includeUnpublished: true) {
      id
      sourceOrder
      ...AdminSourceSortableStatement
    }
  }
`)

export function AdminSourceSortableStatements(props: {
  source: FragmentType<typeof AdminSourceSortableStatementsFragment>
}) {
  const source = useFragment(
    AdminSourceSortableStatementsFragment,
    props.source
  )

  const [statements, setStatements] = useState(
    sortBy(source.statements, (statement) => statement.sourceOrder)
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = statements.findIndex(
          (statement) => statement.id === active.id
        )
        const newIndex = statements.findIndex(
          (statement) => statement.id === over?.id
        )

        const newStatements = arrayMove(statements, oldIndex, newIndex)

        updateSourceStatementsOrder(
          source.id,
          newStatements.map((statement) => statement.id)
        ).then(
          () => toast.success('Pořadí výroků uloženo.'),
          () => toast.error('Došlo k chybě při ukládání pořadí výroků.')
        )

        setStatements(newStatements)
      }
    },
    [source.id, statements]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={statements}
        strategy={verticalListSortingStrategy}
      >
        {statements.map((statement) => (
          <AdminSourceSortableStatement
            key={statement.id}
            statement={statement}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
