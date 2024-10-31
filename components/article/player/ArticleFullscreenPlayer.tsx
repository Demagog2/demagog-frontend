'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import StatementItem from '@/components/statement/Item'
import { displayTime } from '@/libs/date-time'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import { YouTubeVideo } from './players/YouTubeVideo'

const ArticleFullscrenPlayerFragment = gql(`
  fragment ArticleFullscrenPlayer on Article {
    title
    source {
      ...YouTubeVideo
    }
    segments {
      statements {
        id
        statementVideoMark {
          start
        }
        ...StatementDetail
      }
    }
  }
`)

export function ArticleFullscreenPlayer(props: {
  article: FragmentType<typeof ArticleFullscrenPlayerFragment>
  onClose(): void
}) {
  const article = useFragment(ArticleFullscrenPlayerFragment, props.article)

  const { onClose } = props

  const handleEscapeKey = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.code === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey)

    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [handleEscapeKey])

  const statementsColumn = useRef<HTMLDivElement | null>(null)

  if (!article.source) {
    return null
  }

  return (
    <div className="demagog-tv-fullscreen-player">
      {/* Header */}
      <div className="header-bar">
        <Link href="/" className="ms-2 d-flex aling-items-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 17 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.3257 4.75202C14.8196 2.44077 12.1325 0.894531 9.05665 0.894531C4.33283 0.894531 0.506348 4.52252 0.506348 9.00128C0.506348 13.48 4.33283 17.108 9.05665 17.108C12.1252 17.108 14.8098 15.5687 16.3184 13.2668L8.25957 9.03373L16.3257 4.75202Z"
              fill="#111827"
            />
          </svg>
        </Link>

        <h1 className="mx-2 fs-4">{article.title}</h1>

        <button className="header-bar-close-button" onClick={props.onClose}>
          <span className="header-bar-close-button-icon">&times;</span>
          Zavřít přehrávač
        </button>
      </div>

      {/* Video column */}
      <div className="video-column">
        <YouTubeVideo source={article.source} />
      </div>

      {/* Statements column */}
      <div ref={statementsColumn} className="statements-column">
        {article.segments.map((segment) => {
          return segment.statements.map((statement, index) => {
            const lastStatement = index + 1 === segment.statements.length

            return (
              <div key={statement.id} className="statement-container">
                <div className="time-container">
                  <button className="time-button">
                    {displayTime(statement.statementVideoMark?.start ?? 0)}
                  </button>

                  {!lastStatement && <div className="timeline" />}
                </div>

                <div className="statement-content-wrapper">
                  <StatementItem statement={statement} />
                </div>
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}
