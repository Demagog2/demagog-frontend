'use client'

import { AdminSourceSegmentSelector } from './segments/AdminSourceSegmentSelector'
import { AdminSelectedSourceSegment } from './segments/AdminSelectedSourceSegment'

export function AdminSourcesList(props: {
  selectedSourceId?: string

  onRemoveSegment?(): void
  onChange?(sourceId: string): void
}) {
  if (!props.selectedSourceId) {
    return <AdminSourceSegmentSelector {...props} />
  }

  return (
    <AdminSelectedSourceSegment
      {...props}
      selectedSourceId={props.selectedSourceId}
    />
  )
}
