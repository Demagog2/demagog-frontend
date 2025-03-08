'use client'

import { AdminVideoMark } from './AdminVideoMark'
import { useCallback } from 'react'
import classNames from 'classnames'

interface StatementInputProps {
  onStartTimeChange: (time: number) => void
  onStopTimeChange: (time: number) => void
  onGoToMark: (mark: number) => void
  startTime: number
  stopTime: number
  statement: {
    sourceSpeaker: {
      firstName: string
      lastName: string
    }
    content: string
  }
  videoTime: number
}

export const StatementInput = ({
  startTime,
  stopTime,
  onStartTimeChange,
  onStopTimeChange,
  onGoToMark,
  statement,
  videoTime,
}: StatementInputProps) => {
  const hasMarksFilled = startTime > 0 && stopTime > 0
  const isVideoBetweenMarks =
    hasMarksFilled && videoTime >= startTime && videoTime <= stopTime

  const handleStartChange = useCallback(
    (changedStart: number) => {
      onStartTimeChange(changedStart)
      if (changedStart > stopTime) {
        onStopTimeChange(changedStart)
      }
    },
    [stopTime, onStartTimeChange, onStopTimeChange]
  )

  const handleStopChange = useCallback(
    (changedStop: number) => {
      onStopTimeChange(changedStop)
    },
    [onStopTimeChange]
  )

  const goToStartMark = useCallback(() => {
    onGoToMark(startTime)
  }, [startTime, onGoToMark])

  const goToStopMark = useCallback(() => {
    onGoToMark(stopTime)
  }, [stopTime, onGoToMark])

  return (
    <div
      className={classNames('p-4 border-b border-gray-300', {
        'bg-blue-100': isVideoBetweenMarks,
        'bg-yellow-50': !hasMarksFilled,
        'bg-transparent': !isVideoBetweenMarks && hasMarksFilled,
      })}
    >
      <div>
        <strong className="font-semibold">
          {statement.sourceSpeaker.firstName} {statement.sourceSpeaker.lastName}
          :
        </strong>
        <br />
        {statement.content}
      </div>
      <div className="flex items-center mt-3 gap-2">
        <div>
          <AdminVideoMark onChange={handleStartChange} value={startTime} />
        </div>
        <button
          type="button"
          onClick={goToStartMark}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Skočit ve videu na zadaný čas"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z"
            />
          </svg>
        </button>
        <div className="mx-4">—</div>
        <div>
          <AdminVideoMark onChange={handleStopChange} value={stopTime} />
        </div>
        <button
          type="button"
          onClick={goToStopMark}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Skočit ve videu na zadaný čas"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
