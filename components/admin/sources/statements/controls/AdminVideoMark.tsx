'use client'

import { useCallback, useMemo } from 'react'
import { Input } from '@/components/admin/forms/Input'

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

  return (
    <Input
      type="time"
      step="1"
      value={timeValue}
      name={name}
      onChange={handleTimeChange}
      className="w-[120px]"
    />
  )
}
