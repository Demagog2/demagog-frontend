import { padStart } from 'lodash'
import { DateTime } from 'luxon'

export function displayDate(date: string): string {
  return DateTime.fromISO(date)
    .setLocale('cs')
    .setZone('Europe/Prague')
    .toLocaleString(DateTime.DATE_FULL)
}

export function displayDateTime(datetime: string): string {
  return DateTime.fromISO(datetime)
    .setLocale('cs')
    .setZone('Europe/Prague')
    .toLocaleString(DateTime.DATETIME_MED)
}

export function displayDateTimeRelative(datetime: string): string | null {
  return DateTime.fromISO(datetime)
    .setLocale('cs')
    .setZone('Europe/Prague')
    .toRelative()
}

export function dateInputFormat(datetime: string): string {
  return DateTime.fromISO(datetime)
    .setLocale('cs')
    .setZone('Europe/Prague')
    .toFormat('yyyy-MM-dd')
}

export function displayTime(timeInSeconds: number): string {
  return `${Math.floor(timeInSeconds / 60)}:${padStart(`${timeInSeconds % 60}`, 2, '0')}`
}

export function isSameOrAfterToday(date: string): boolean {
  return DateTime.fromISO(date).diffNow().as('seconds') <= 0
}

export function incrementTime(
  timeInSeconds: number,
  unit: 'seconds' | 'minutes' | 'hours'
): number {
  switch (unit) {
    case 'hours':
      return timeInSeconds + 3600
    case 'minutes':
      return timeInSeconds + 60
    case 'seconds':
      return timeInSeconds + 1
  }
}
