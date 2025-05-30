'use client'

import { gql } from '@/__generated__'
import { useQuery } from '@apollo/client'
import { SecondaryButton } from '../../layout/buttons/SecondaryButton'

export function AdminSelectedQuizQuestionSegment(props: {
  selectedQuizQuestionId: string
  onRemoveSegment?(): void
}) {
  const { data } = useQuery(
    gql(`
        query AdminSelectedQuizQuestionSegment($id: ID!) {
          quizQuestion(id: $id) {
            id
            title
            description
            quizAnswers {
              id
              text
              isCorrect
            }
          }
        }
      `),
    { variables: { id: props.selectedQuizQuestionId } }
  )

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="bg-white px-4 py-5 sm:px-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          <a
            href={`/beta/admin/education/${data?.quizQuestion?.id}`}
            className="hover:underline"
          >
            {data?.quizQuestion?.title}
          </a>
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {data?.quizQuestion?.description ?? 'Popis nevyplněn'}
        </p>
      </div>
      <div className="divide-y divide-gray-100 px-4 py-5 sm:px-6">
        <div className="flex flex-col">
          <div className="space-y-4 text-gray-600">
            <p className="font-semibold">Odpovědi:</p>
            <div className="mt-2 space-y-2 w-full max-w-xl">
              {data?.quizQuestion?.quizAnswers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`p-3 rounded-md border ${
                    answer.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span>{answer.text}</span>
                    {answer.isCorrect && (
                      <span className="text-green-600 text-sm">
                        (Správná odpověď)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <SecondaryButton onClick={props.onRemoveSegment} className="w-auto">
              Odebrat
            </SecondaryButton>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 text-sm"></div>
    </div>
  )
}
