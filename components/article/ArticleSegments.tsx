'use client'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerWithStats } from '@/components/speaker/SpeakerWithStats'
import { ArticleV2Preview } from './ArticleV2Preview'
import { ArticleQuote } from './ArticleQuote'
import { StatementDisplayMode } from '@/libs/statements/display-mode'
import classNames from 'classnames'
import { nicerLinksNoTruncate } from '@/libs/comments/text'
import { StatementFullExplanation } from '../statement/StatementFullExplanation'
import { StatementHeader } from '../statement/StatementHeader'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'

const ArticleSegmentsFragment = gql(`
  fragment ArticleSegments on Article {
    segments {
      id
      segmentType
      statements {
        id
        ...StatementFullExplanation
      }
      content {
        edges {
          node {
            ... on ArticleNode {
              article {
                ...ArticleV2PreviewFragment
              }
            }
            ... on StatementNode {
              statement {
                ...StatementHeader
              }
            }
            ... on TextNode {
              text
            }
            ... on BlockQuoteNode {
              ...ArticleQuote
            }
          }
          cursor
        }
      }
      quizQuestion {
        id
        title
        description
        quizAnswers {
          id
          isCorrect
          text
        }
      }
    }
    debateStats {
      ...SpeakerWithStats
      speaker {
        id
      }
    }
    showPlayer
  }
`)

type ArticleStatementsProps = {
  data: FragmentType<typeof ArticleSegmentsFragment>
}

export function ArticleSegments(props: ArticleStatementsProps) {
  const { segments, debateStats, showPlayer } = useFragment(
    ArticleSegmentsFragment,
    props.data
  )
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)

  return (
    <>
      {segments.map((segment) => (
        <div key={segment.id}>
          {segment.segmentType === 'text' && (
            <div className="row justify-content-center">
              <div className="col fs-6 content-redesign">
                {segment.content.edges?.map((edge) => {
                  if (!edge?.node) {
                    return null
                  }

                  const { node, cursor } = edge

                  if (node.__typename === 'TextNode') {
                    return (
                      <div
                        className={'content-text-node mt-6'}
                        key={cursor}
                        dangerouslySetInnerHTML={{
                          __html: nicerLinksNoTruncate(node.text),
                        }}
                      />
                    )
                  }

                  if (node.__typename === 'BlockQuoteNode') {
                    return <ArticleQuote key={cursor} node={node} />
                  }

                  if (node.__typename === 'ArticleNode' && node.article) {
                    return (
                      <ArticleV2Preview
                        isEmbedded
                        key={cursor}
                        article={node.article}
                      />
                    )
                  }

                  if (node.__typename === 'StatementNode' && node.statement) {
                    return (
                      <StatementHeader
                        className="mt-10"
                        key={cursor}
                        statement={node.statement}
                        displayMode={StatementDisplayMode.EMBEDDED}
                      />
                    )
                  }
                })}
              </div>
            </div>
          )}
          {segment.segmentType === 'source_statements' && (
            <div>
              <div
                className={classNames('row g-5 g-lg-10', {
                  'mt-1': showPlayer,
                })}
              >
                {debateStats?.map((debateStat) => (
                  <div
                    key={debateStat.speaker?.id}
                    className="col-12 col-sm-11 col-md-8 col-lg-6  col-xl-5 col-xxl-4"
                  >
                    <div className="speakers-overview-speaker">
                      <SpeakerWithStats data={debateStat} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-12">
                <div className="mt-5 mt-lg-10">
                  {segment.statements.map((statement) => (
                    <StatementFullExplanation
                      key={statement.id}
                      statement={statement}
                      className="mb-10"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {segment.segmentType === 'quiz_question' && segment.quizQuestion && (
            <div className="row justify-content-center mt-5">
              <div className="col-12 col-md-8">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title mb-4">
                      {segment.quizQuestion.title}
                    </h3>
                    {segment.quizQuestion.description && (
                      <p className="card-text mb-4">
                        {segment.quizQuestion.description}
                      </p>
                    )}
                    <div className="d-flex flex-column gap-3">
                      {segment.quizQuestion.quizAnswers.map((answer) => (
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
                            <p className="text-xl mb-0">
                              Správná odpověď:{' '}
                              {
                                segment.quizQuestion.quizAnswers.find(
                                  (answer) => answer.isCorrect
                                )?.text
                              }
                            </p>
                          </div>
                          <p className="mb-0">
                            {segment.quizQuestion.description && (
                              <span className="d-block mt-2">
                                Jedná se o názor autora, nemůžeme ověřit,
                                protože nám neříká, co znamená „výrazně zlepší
                                život seniorů.“
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
          )}
        </div>
      ))}
    </>
  )
}
