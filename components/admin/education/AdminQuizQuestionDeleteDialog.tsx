'use client'

import { useCallback, useRef } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../layout/dialogs/AdminDeleteDialog'
import { deleteQuizQuestion } from '@/app/(admin)/beta/admin/education/actions'

const AdminQuizQuestionDeleteFragment = gql(`
    fragment AdminQuizQuestionDelete on QuizQuestion {
      id
      title
    }
  `)

export default function AdminQuizQuestionDelete(props: {
  quizQuestion: FragmentType<typeof AdminQuizQuestionDeleteFragment>
}) {
  const quizQuestion = useFragment(
    AdminQuizQuestionDeleteFragment,
    props.quizQuestion
  )

  const handleDeleteQuizQuestion = useCallback(
    () => deleteQuizQuestion(quizQuestion.id),
    [quizQuestion]
  )

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      title="Smazat kvízovou otázku"
      description={
        <>
          Chcete opravdu smazat kvízovou otázku &quot;{quizQuestion.title}
          &quot;? Tato akce je nevratná.
        </>
      }
      onDelete={handleDeleteQuizQuestion}
    ></AdminDeleteDialog>
  )
}
