import * as R from 'ramda'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'

dayjs.extend(localeData)
dayjs.extend(arraySupport)

export const getDaysRange = (
  startDate: Date,
  endDate: Date,
  selectedDate: Date
) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const selected = dayjs(selectedDate)
  const isLessThanOneMonth =
    start.year() === end.year() && start.month() === end.month()

  const numberOfDaysInMonth = dayjs([
    selected.year(),
    selected.month(),
  ]).daysInMonth()

  const from = isLessThanOneMonth ? start.date() : 1
  const to =
    !isLessThanOneMonth &&
    !(selected.year() === end.year() && selected.month() === end.month())
      ? numberOfDaysInMonth + 1
      : end.date() + 1

  return R.range(from, to).map((day: any) => ({
    text: toLocale(dayjs(start).add(day, 'days').format('D MMMM')),
    date: dayjs(start).add(day, 'days'),
  }))
}

export const getHoursRange = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const isLessThanOneDay =
    start.year() === end.year() &&
    start.month() === end.month() &&
    start.date() === end.date()
  const startHour = isLessThanOneDay ? start.hour() : 0
  const endHour = isLessThanOneDay ? end.hour() : 24
  return R.range(startHour, endHour)
    .map((number: any) => String(number).padStart(2, '0'))
    .map((number: any) => toLocale(number))
}

export const getMinutesRange = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const isLessThanOneHour =
    start.year() === end.year() &&
    start.month() === end.month() &&
    start.date() === end.date() &&
    start.hour() === end.hour()
  const startMinute = isLessThanOneHour ? start.hour() : 0
  const endMinute = isLessThanOneHour ? end.hour() : 60
  return R.range(startMinute, endMinute)
    .map((number: any) => String(number).padStart(2, '0'))
    .map((number: any) => toLocale(number))
}

interface InviteLinkExpireDatePickerProps {
  onChange: (selectedDate: Date) => unknown
  selected: Date
  start: Date
  end: Date
}

export function TimePicker({
  onChange,
  selected,
  start,
  end,
}: InviteLinkExpireDatePickerProps) {
  if (+start > +selected) return <div>invalid input</div>
  if (+start > +end) return <div>invalid input</div>
  if (+selected > +end) return <div>invalid input</div>
  const [selectedDate, setSelectedDate] = useState(dayjs(selected))

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const { date } = getDaysRange(start, end, selected)[newIndex]
    const newDate = dayjs(selectedDate.date(date.date()).month(date.month()))
    setSelectedDate(newDate)
  }

  const onHourChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getHoursRange(start, end)[newIndex]
    const newHour = toEnglishNumber(
      newValue.slice(
        newValue.indexOf(toLocale(0)) === -1 ? 0 : newValue.indexOf(toLocale(0))
      )
    )
    const newDate = dayjs(selectedDate.hour(+newHour))

    setSelectedDate(newDate)
  }

  const onMinuteChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getMinutesRange(start, end)[newIndex]
    if (!newValue) return
    const newMinute = toEnglishNumber(
      newValue.slice(
        newValue.indexOf(toLocale(0)) === -1 ? 0 : newValue.indexOf(toLocale(0))
      )
    )
    const newDate = dayjs(selectedDate.minute(+newMinute))
    setSelectedDate(newDate)
  }

  const parseSelected = () => {
    const minuteValue = toLocale(String(selectedDate.minute()).padStart(2, '0'))
    const minuteIndex = getMinutesRange(start, end).indexOf(minuteValue)
    const hourValue = toLocale(String(selectedDate.hour()).padStart(2, '0'))
    const hourIndex = getHoursRange(start, end).indexOf(hourValue)
    const dayValue = toLocale(selectedDate.format('D MMMM'))
    const dayIndex = getDaysRange(start, end, selected)
      .map(({ text }) => text)
      .indexOf(dayValue)
    return { minuteIndex, hourIndex, dayIndex }
  }

  return (
    <Picker
      values={[
        {
          selectedIndex: parseSelected().minuteIndex,
          items: getMinutesRange(start, end),
          onUpdate: onMinuteChange,
        },
        {
          selectedIndex: parseSelected().hourIndex,
          items: getHoursRange(start, end),
          onUpdate: onHourChange,
        },
        {
          selectedIndex: parseSelected().dayIndex,
          items: getDaysRange(start, end, selected).map(({ text }) => text),
          onUpdate: onDayChange,
        },
      ]}
    />
  )
}
