'use client'

import { useCallback, useMemo } from 'react'

export const AdminVideoMark = ({
  onChange,
  value,
}: {
  onChange: (value: number) => void
  value: number
}) => {
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

  return (
    <input
      type="time"
      step="1"
      value={timeValue}
      onChange={handleTimeChange}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  )
}
