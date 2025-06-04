'use client'

import { gql } from '@/__generated__'
import { useQuery } from '@apollo/client'
import { SecondaryButton } from '../../layout/buttons/SecondaryButton'
import { AdminQuizQuestionDetail } from '../../education/AdminQuizQuestionDetail'

export function AdminSelectedQuizQuestionSegment(props: {
  selectedQuizQuestionId: string
  onRemoveSegment?(): void
}) {
  const { data } = useQuery(
    gql(`
        query AdminSelectedQuizQuestionSegment($id: ID!) {
          quizQuestion(id: $id) {
            ...AdminQuizQuestionDetail
          }
        }
      `),
    { variables: { id: props.selectedQuizQuestionId } }
  )

  if (!data?.quizQuestion) {
    return null
  }

  return (
    <div className="px-4 py-5 sm:px-6 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="flex flex-col">
        {
          <AdminQuizQuestionDetail
            quizQuestion={data.quizQuestion}
            containsLink
          />
        }

        <div>
          <SecondaryButton onClick={props.onRemoveSegment} className="w-auto">
            Odebrat
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}
