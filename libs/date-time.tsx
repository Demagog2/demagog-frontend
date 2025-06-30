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
  let hours = Math.floor(timeInSeconds / 3600)
  let minutes = Math.floor((timeInSeconds % 3600) / 60)
  let seconds = timeInSeconds % 60

  switch (unit) {
    case 'hours':
      hours = hours >= 23 ? 0 : hours + 1
      return hours * 3600 + minutes * 60 + seconds
    case 'minutes':
      minutes = minutes >= 59 ? 0 : minutes + 1
      return hours * 3600 + minutes * 60 + seconds
    case 'seconds':
      seconds = seconds >= 59 ? 0 : seconds + 1
      return hours * 3600 + minutes * 60 + seconds
  }
}

export function decrementTime(
  timeInSeconds: number,
  unit: 'seconds' | 'minutes' | 'hours'
): number {
  let hours = Math.floor(timeInSeconds / 3600)
  let minutes = Math.floor((timeInSeconds % 3600) / 60)
  let seconds = timeInSeconds % 60

  switch (unit) {
    case 'hours':
      hours = hours <= 0 ? 23 : hours - 1
      return hours * 3600 + minutes * 60 + seconds
    case 'minutes':
      minutes = minutes <= 0 ? 59 : minutes - 1
      return hours * 3600 + minutes * 60 + seconds
    case 'seconds':
      seconds = seconds <= 0 ? 59 : seconds - 1
      return hours * 3600 + minutes * 60 + seconds
  }
}
