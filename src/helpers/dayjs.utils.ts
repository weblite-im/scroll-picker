import dayjs from 'dayjs'
import * as R from 'ramda'
import { toLocale } from './fuctions/text'

export const getDaysRange = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  return R.range(0, end.diff(start, 'day') + 1).map((day: any) => {
    const date = dayjs(start).add(day, 'day')
    return { text: toLocale(date.format('D MMMM')), date }
  })
}

function isSameDay(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return (
    start.year() === end.year() &&
    start.month() === end.month() &&
    start.date() === end.date()
  )
}

export const getHoursRange = (
  startDate: Date,
  endDate: Date,
  selected: dayjs.Dayjs
) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  const startHour = isSameDay(start, selected) ? start.hour() : 0
  const endHour = isSameDay(end, selected) ? end.hour() + 1 : 24

  return R.range(startHour, endHour)
    .map((number: any) => String(number).padStart(2, '0'))
    .map((number: any) => toLocale(number))
}

function isSameHour(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return isSameDay(start, end) && start.hour() === end.hour()
}

export const getMinutesRange = (
  startDate: Date,
  endDate: Date,
  selected: dayjs.Dayjs
) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  const startMinute = isSameHour(start, selected) ? start.hour() : 0
  const endMinute = isSameHour(end, selected) ? end.hour() : 60

  return R.range(startMinute, endMinute)
    .map((number: any) => String(number).padStart(2, '0'))
    .map((number: any) => toLocale(number))
}

export function clampDate(start: Date, end: Date, newDate: dayjs.Dayjs) {
  if (dayjs(end).diff(newDate) < 0) return dayjs(end)
  if (dayjs(start).diff(newDate) > 0) return dayjs(start)
  return newDate
}
