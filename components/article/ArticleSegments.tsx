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
import { ArticleQuizSegment } from './ArticleQuizSegment'
import { useState } from 'react'

const ArticleSegmentsFragment = gql(`
  fragment ArticleSegments on Article {
    segments {
      id
      segmentType
      statements(includeUnpublished: $includeUnpublished) {
        id
        assessment {
          veracity {
            key
          }
        }
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
        ...ArticleQuizSegment
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

export function ArticleSegments(props: ArticleStatementsProps & {}) {
  const { segments, debateStats, showPlayer } = useFragment(
    ArticleSegmentsFragment,
    props.data
  )

  const [activeVeracity, setActiveVeracity] = useState<string | null>(null)

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
                      <SpeakerWithStats
                        data={debateStat}
                        activeVeracity={activeVeracity}
                        onStatsClick={setActiveVeracity}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-12">
                <div className="mt-5 mt-lg-10">
                  {segment.statements
                    .filter((statement) => {
                      if (!activeVeracity) {
                        return true
                      }

                      return (
                        statement.assessment.veracity?.key === activeVeracity
                      )
                    })
                    .map((statement) => (
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
            <ArticleQuizSegment quizQuestion={segment.quizQuestion} />
          )}
        </div>
      ))}
    </>
  )
}
