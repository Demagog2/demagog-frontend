'use client'

import { AdminQuizQuestionSegmentSelector } from './segments/AdminQuizQuestionSegmentSelector'
import { AdminSelectedQuizQuestionSegment } from './segments/AdminSelectedQuizQuestionSegment'

export function AdminQuizQuestionList(props: {
  selectedQuizQuestionId?: string
  onRemoveSegment?(): void
  onChange?(quizQuestionId: string): void
}) {
  if (!props.selectedQuizQuestionId) {
    return <AdminQuizQuestionSegmentSelector {...props} />
  }

  return (
    <AdminSelectedQuizQuestionSegment
      {...props}
      selectedQuizQuestionId={props.selectedQuizQuestionId}
    />
  )
}
