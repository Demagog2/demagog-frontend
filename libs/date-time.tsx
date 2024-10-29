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

export function dateInputFormat(datetime: string): string {
  return DateTime.fromISO(datetime)
    .setLocale('cs')
    .setZone('Europe/Prague')
    .toFormat('yyyy-MM-dd')
}

export function isSameOrAfterToday(date: string): boolean {
  return DateTime.fromISO(date).diffNow().as('seconds') <= 0
}
