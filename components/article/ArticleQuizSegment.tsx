'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { CheckIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useState } from 'react'

const ArticleQuizSegmentFragment = gql(`
    fragment ArticleQuizSegment on QuizQuestion {
      id
      title
      description
      quizAnswers {
        id
        isCorrect
        text
      }
    }
  `)

export function ArticleQuizSegment(props: {
  quizQuestion: FragmentType<typeof ArticleQuizSegmentFragment>
}) {
  const quizQuestion = useFragment(
    ArticleQuizSegmentFragment,
    props.quizQuestion
  )
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-12 col-md-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">{quizQuestion.title}</h3>
            {quizQuestion.description && (
              <p className="card-text mb-4">{quizQuestion.description}</p>
            )}
            <div className="d-flex flex-column gap-3">
              {quizQuestion.quizAnswers.map((answer) => (
                <button
                  key={answer.id}
                  className={classNames('btn text-start', {
                    'btn-outline-success text-black bg-success bg-opacity-10':
                      selectedAnswerId && answer.isCorrect,
                    'btn-outline-danger text-dark':
                      selectedAnswerId && !answer.isCorrect,
                    'btn-outline-primary': !selectedAnswerId,
                  })}
                  onClick={() => setSelectedAnswerId(answer.id)}
                  disabled={selectedAnswerId !== null}
                >
                  {answer.text}
                  {selectedAnswerId !== null && (
                    <span
                      className={classNames('ms-2 fs-5 float-end', {
                        'text-success': answer.isCorrect,
                        'text-danger': !answer.isCorrect,
                      })}
                    >
                      {answer.isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedAnswerId !== null && (
              <div
                className={classNames(
                  'mt-4 p-3 rounded',
                  'bg-light border',
                  'd-flex align-items-center gap-3'
                )}
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2">
                    <CheckIcon
                      className="flex-shrink-0"
                      width={20}
                      color="green"
                    />
                    <p className="text-xl fw-bold mb-0">
                      Správná odpověď:{' '}
                      {
                        quizQuestion.quizAnswers.find(
                          (answer) => answer.isCorrect
                        )?.text
                      }
                    </p>
                  </div>
                  <p className="mb-0">
                    {quizQuestion.description && (
                      <span className="d-block mt-2">
                        Jedná se o názor autora, nemůžeme ověřit, protože nám
                        neříká, co znamená „výrazně zlepší život seniorů.“
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
