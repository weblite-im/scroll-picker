import * as R from 'ramda'
// @ts-ignore
import PersianDate from 'persian-date'
import { toLocale } from './fuctions/text'

export const getPersianDaysRange = (startDate: Date, endDate: Date) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)

  return R.range(0, end.diff(start, 'days') + 1).map((day: any) => {
    const date = new PersianDate(start).add('days', day)
    return { text: date.format('D MMMM'), date }
  })
}

function isSamePersianDay(start: PersianDate, end: PersianDate) {
  return PersianDate.isSameDay(start, end)
}

export const getPersianHoursRange = (
  startDate: Date,
  endDate: Date,
  selectedDate: PersianDate
) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
  const startHour = isSamePersianDay(start, selectedDate) ? start.hour() : 0
  const endHour = isSamePersianDay(end, selectedDate) ? end.hour() + 1 : 24

  return R.range(startHour, endHour).map((number: any) =>
    toLocale(String(number).padStart(2, '0'))
  )
}

function isSamePersianHour(start: PersianDate, end: PersianDate) {
  return isSamePersianDay(start, end) && start.hour() === end.hour()
}

export const getPersianMinutesRange = (
  startDate: Date,
  endDate: Date,
  selectedDate: PersianDate
) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)

  const startMinute = isSamePersianHour(selectedDate, start)
    ? start.minute()
    : 0
  const endMinute = isSamePersianHour(selectedDate, end) ? end.minute() : 60

  return R.range(startMinute, endMinute)
    .map((number: any) => String(number).padStart(2, '0'))
    .map((number: any) => toLocale(number))
}

export function clampPersianDate(
  start: Date,
  end: Date,
  newDate: typeof PersianDate
) {
  if (new PersianDate(end).diff(newDate) < 0) return new PersianDate(end)
  if (new PersianDate(start).diff(newDate) > 0) return new PersianDate(start)
  return newDate
}
