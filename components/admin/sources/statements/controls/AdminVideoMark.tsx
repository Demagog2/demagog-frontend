'use client'

import { useCallback, useMemo } from 'react'
import { Input } from '@/components/admin/forms/Input'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { incrementTime, decrementTime } from '@/libs/date-time'

interface AdminVideoMarkProps {
  onChange: (value: number) => void
  value: number
  name?: string
}

export function AdminVideoMark({ onChange, value, name }: AdminVideoMarkProps) {
  const timeValue = useMemo(() => {
    let seconds = value

    const hours = Math.floor(seconds / 3600)
    seconds = seconds - hours * 3600

    const minutes = Math.floor(seconds / 60)
    seconds = seconds - minutes * 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [value])

  const handleTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [hours, minutes, seconds] = event.target.value
        .split(':')
        .map(Number)
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      onChange(totalSeconds)
    },
    [onChange]
  )

  const handleSegmentIncrement = useCallback(
    (segment: 'hours' | 'minutes' | 'seconds') => {
      const incrementedTime = incrementTime(value, segment)
      onChange(incrementedTime)
    },
    [value, onChange]
  )

  const handleSegmentDecrement = useCallback(
    (segment: 'hours' | 'minutes' | 'seconds') => {
      const decrementedTime = decrementTime(value, segment)
      onChange(decrementedTime)
    },
    [value, onChange]
  )

  return (
    <div className="m-5">
      <div className="flex align-items-center justify-content-center w-[70px] ms-3 md:ms-2">
        <button
          type="button"
          title="Navýšit hodiny"
          onClick={() => handleSegmentIncrement('hours')}
          className="hover:bg-gray-100 rounded px-1"
        >
          <ChevronUpIcon width={16} height={16} />
        </button>
        <button
          type="button"
          title="Navýšit minuty"
          onClick={() => handleSegmentIncrement('minutes')}
          className="hover:bg-gray-100 rounded px-1"
        >
          <ChevronUpIcon width={16} height={16} />
        </button>
        <button
          type="button"
          title="Navýšit sekundy"
          onClick={() => handleSegmentIncrement('seconds')}
          className="hover:bg-gray-100 rounded px-1"
        >
          <ChevronUpIcon width={16} height={16} />
        </button>
      </div>
      <Input
        type="time"
        step="1"
        value={timeValue}
        name={name}
        onChange={handleTimeChange}
        className="w-[120px]"
      />
      <div className="flex align-items-center justify-content-center w-[80px] mt-2  ms-3 md:ms-2">
        <button
          type="button"
          title="Snížit hodiny"
          onClick={() => handleSegmentDecrement('hours')}
          className="hover:bg-gray-100 rounded px-1"
        >
          <ChevronDownIcon width={16} height={16} />
        </button>
        <button
          type="button"
          title="Snížit minuty"
          onClick={() => handleSegmentDecrement('minutes')}
          className="hover:bg-gray-100 rounded px-1"
        >
          <ChevronDownIcon width={16} height={16} />
        </button>
        <button
          type="button"
          title="Snížit sekundy"
          onClick={() => handleSegmentDecrement('seconds')}
          className="hover:bg-gray-100 rounded px-1"
        >
          <ChevronDownIcon width={16} height={16} />
        </button>
      </div>
    </div>
  )
}
