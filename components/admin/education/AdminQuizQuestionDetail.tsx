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
        reason
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

  const correctAnswer = quizQuestion?.quizAnswers.find(
    (answer) => answer.isCorrect
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
          <div className="text-gray-600">
            <p className="font-semibold">Odpovědi:</p>
            <div className="w-full max-w-xl">
              {quizQuestion?.quizAnswers.map((answer, index) => (
                <>
                  <div
                    key={answer.id}
                    className={`p-3 rounded-md border mt-2 ${
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
                </>
              ))}
              {correctAnswer && (
                <div className="mt-4">
                  <p className="font-semibold">
                    Správná odpověď: {correctAnswer.text}
                  </p>
                  <p className="mt-2">{correctAnswer.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
