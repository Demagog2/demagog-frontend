import { gql, FragmentType, useFragment } from '@/__generated__'

export const AdminQuizQuestionDetailFragment = gql(`
    fragment AdminQuizQuestionDetail on QuizQuestion {
      createdAt
      description
      id
      title
      updatedAt
      quizAnswers {
        id
        isCorrect
        text
      }
    }
  `)

export function AdminQuizQuestionDetail(props: {
  quizQuestion?: FragmentType<typeof AdminQuizQuestionDetailFragment> | null
  containsLink?: boolean
}) {
  const quizQuestion = useFragment(
    AdminQuizQuestionDetailFragment,
    props.quizQuestion
  )

  if (!quizQuestion) {
    return null
  }

  return (
    <>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {props.containsLink ? (
            <a
              href={`/beta/admin/education/${quizQuestion.id}`}
              className="hover:underline"
            >
              {quizQuestion?.title}
            </a>
          ) : (
            quizQuestion?.title
          )}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {quizQuestion?.description ?? 'Popis nevyplněn'}
        </p>
      </div>
      <div className="divide-y divide-gray-100 px-4 py-5 sm:px-6">
        <div className="flex flex-col">
          <div className="space-y-4 text-gray-600">
            <p className="font-semibold">Odpovědi:</p>
            <div className="mt-2 space-y-2 w-full max-w-xl">
              {quizQuestion?.quizAnswers.map((answer, index) => (
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
        </div>
      </div>
    </>
  )
}
