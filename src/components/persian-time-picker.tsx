import * as R from 'ramda'
import { useEffect, useState } from 'react'
// @ts-ignore
import PersianDate from 'persian-date'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'

export const getDaysRange = (
  startDate: Date,
  endDate: Date,
  selected: typeof PersianDate
) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
  const isLessThanOneMonth =
    start.year() === end.year() && start.month() === end.month()

  const numberOfDaysInMonth = new PersianDate([
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
    text: new PersianDate(start).add('days', day).format('D MMMM'),
    date: new PersianDate(start).add('days', day),
  }))
}

export const getHoursRange = (startDate: Date, endDate: Date) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
  const isLessThanOneDay =
    start.year() === end.year() &&
    start.month() === end.month() &&
    start.date() === end.date()
  const startHour = isLessThanOneDay ? start.hour() : 0
  const endHour = isLessThanOneDay ? end.hour() : 24
  return R.range(startHour, endHour).map((number: any) =>
    toLocale(String(number).padStart(2, '0'))
  )
}

export const getMinutesRange = (startDate: Date, endDate: Date) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
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

interface PersianTimePickerProps {
  selected: Date
  start: Date
  end: Date
  onChange: (selectedDate: Date) => unknown
}

export function PersianTimePicker({
  selected,
  start,
  end,
  onChange,
}: PersianTimePickerProps) {
  if (+start > +selected) return <div>invalid input</div>
  if (+start > +end) return <div>invalid input</div>
  if (+selected > +end) return <div>invalid input</div>
  const [selectedDate, setSelectedDate] = useState(new PersianDate(selected))

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const { date } = getDaysRange(start, end, selectedDate)[newIndex]
    const newDate = new PersianDate(
      selectedDate.date(date.date()).month(date.month())
    )
    setSelectedDate(newDate)
  }

  const onHourChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getHoursRange(start, end)[newIndex]
    const newHour = toEnglishNumber(
      newValue.slice(newValue.indexOf('۰') === -1 ? 0 : newValue.indexOf('۰'))
    )
    const newDate = new PersianDate(selectedDate.hour(newHour))

    setSelectedDate(newDate)
  }

  const onMinuteChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getMinutesRange(start, end)[newIndex]
    const newMinute = toEnglishNumber(
      newValue.slice(newValue.indexOf('۰') === -1 ? 0 : newValue.indexOf('۰'))
    )
    const newDate = new PersianDate(selectedDate.minute(newMinute))
    setSelectedDate(newDate)
  }

  const parseSelected = () => {
    const minuteValue = toLocale(String(selectedDate.minute()).padStart(2, '0'))
    const minuteIndex = getMinutesRange(start, end).indexOf(minuteValue)
    const hourValue = toLocale(String(selectedDate.hour()).padStart(2, '0'))
    const hourIndex = getHoursRange(start, end).indexOf(hourValue)
    const dayValue = selectedDate.format('D MMMM')
    const dayIndex = getDaysRange(start, end, selectedDate)
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
          items: getDaysRange(start, end, selectedDate).map(({ text }) => text),
          onUpdate: onDayChange,
        },
      ]}
    />
  )
}
