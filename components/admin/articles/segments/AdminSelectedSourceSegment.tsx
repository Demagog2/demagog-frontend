'use client'

import { gql } from '@/__generated__'
import { useQuery } from '@apollo/client'
import { Button } from '@headlessui/react'
import { AdminStatement } from './AdminStatement'

export function AdminSelectedSourceSegment(props: {
  selectedSourceId: string
  onRemoveSegment?(): void
}) {
  const { data } = useQuery(
    gql(`
      query AdminSelectedSourceSegment($id: Int!) {
        source(
          id: $id
        ) {
          id
          name
          statements(includeUnpublished: true) {
            id
            ...AdminStatement
          }
        }
      }
    `),
    { variables: { id: parseInt(props.selectedSourceId, 10) } }
  )

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {data?.source.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">Lorem ipsum</p>
      </div>
      <div className="divide-y divide-gray-100 px-4 py-5">
        {data?.source?.statements.map((statement) => (
          <AdminStatement key={statement.id} statement={statement} />
        ))}
      </div>
      <div className="px-4 py-4 sm:px-6">
        <Button onClick={props.onRemoveSegment}>Odebrat</Button>
      </div>
    </div>
  )
}
