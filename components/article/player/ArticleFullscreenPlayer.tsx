'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { displayTime } from '@/libs/date-time'
import classNames from 'classnames'
import { orderBy } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VideoPlayer } from './players/VideoPlayer'
import { YouTubeVideo } from './players/YouTubeVideo'
import { StatementDisplayMode } from '@/libs/statements/display-mode'
import { StatementFullExplanation } from '@/components/statement/StatementFullExplanation'

const ArticleFullscrenPlayerFragment = gql(`
  fragment ArticleFullscrenPlayer on Article {
    title
    source {
      ...YouTubeVideo
    }
    segments {
      statements(includeUnpublished: $includeUnpublished) {
        id
        statementVideoMark {
          start
          stop
        }
        ...StatementFullExplanation
      }
    }
  }
`)

const getStatementId = (id: string) => `player-statement-${id}`

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

  const [highlightedStatementId, setHiglightedStatementId] = useState<
    string | null
  >(null)

  const statementsColumn = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<VideoPlayer | null>(null)

  const statements = useMemo(() => {
    return orderBy(
      article.segments.flatMap((segment) =>
        segment.statements.filter((statement) => statement.statementVideoMark)
      ),
      (s) => s.statementVideoMark?.start
    )
  }, [article])

  useEffect(() => {
    const handle = setInterval(() => {
      if (videoRef.current) {
        const time = videoRef.current.getTime()

        const matchedStatementId =
          statements.find(
            (statement) =>
              statement.statementVideoMark &&
              statement.statementVideoMark.start < time &&
              statement.statementVideoMark.stop > time
          )?.id ?? null

        if (
          matchedStatementId &&
          matchedStatementId !== highlightedStatementId
        ) {
          statementsColumn.current?.scroll({
            top:
              document.getElementById(getStatementId(matchedStatementId))
                ?.offsetTop ?? 0 - 15,
            left: 0,
            behavior: 'smooth',
          })
        }
        setHiglightedStatementId(matchedStatementId)
      }
    }, 500)

    return () => clearInterval(handle)
  }, [setHiglightedStatementId, highlightedStatementId, statements])

  useEffect(() => {
    document.body.style.position = 'fixed'

    let headMetaViewportContentBefore: string | null

    const headMetaViewport = document.head.querySelector('meta[name=viewport]')
    if (headMetaViewport) {
      headMetaViewportContentBefore = headMetaViewport.getAttribute('content')
      headMetaViewport.setAttribute('content', 'width=800')
    }

    return () => {
      document.body.style.position = 'static'

      if (headMetaViewport && headMetaViewportContentBefore) {
        headMetaViewport.setAttribute('content', headMetaViewportContentBefore)
      }
    }
  }, [])

  if (!article.source) {
    return null
  }

  return (
    <div className="demagog-tv-fullscreen-player">
      {/* Header */}
      <div className="header-bar">
        <a href="/" className="ms-2 d-flex aling-items-center">
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
        </a>

        <h1 className="mx-2 fs-4">{article.title}</h1>

        <button className="header-bar-close-button" onClick={props.onClose}>
          <span className="header-bar-close-button-icon">&times;</span>
          Zavřít přehrávač
        </button>
      </div>

      {/* Video column */}
      <div className="video-column">
        <YouTubeVideo ref={videoRef} source={article.source} />
      </div>

      {/* Statements column */}
      <div ref={statementsColumn} className="statements-column">
        {statements.map((statement, index) => {
          const lastStatement = index + 1 === statements.length
          const isHighlighted = statement.id === highlightedStatementId

          return (
            <div
              id={getStatementId(statement.id)}
              key={statement.id}
              className={classNames('statement-container', {
                highlighted: isHighlighted,
              })}
            >
              <div className="time-container">
                <button
                  className="time-button"
                  onClick={() => {
                    videoRef.current?.goToTime(
                      statement.statementVideoMark?.start ?? 0
                    )
                  }}
                >
                  {displayTime(statement.statementVideoMark?.start ?? 0)}
                </button>

                {!lastStatement && <div className="timeline" />}
              </div>

              <div className="statement-content-wrapper">
                <StatementFullExplanation
                  statement={statement}
                  className="mb-10"
                  displayMode={StatementDisplayMode.VERTICAL}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
