import * as R from 'ramda'
import { useEffect, useState } from 'react'
// @ts-ignore
import PersianDate from 'persian-date'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import { t } from '../setup/i18n'

export const rangeOfValidDays = (
  startDate: Date,
  endDate: Date,
  selected: typeof PersianDate
) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
  const now = new PersianDate(new Date())
  const isLessThanOneMonth =
    start.year() === end.year() && start.month() === end.month()

  const numberOfDaysInMonth = new PersianDate([
    selected.year(),
    selected.month(),
  ]).daysInMonth()

  const containsNow = start.diff(now) <= 0 && end.diff(now) >= 0

  const from = isLessThanOneMonth ? start.date() : 1
  const to =
    !isLessThanOneMonth &&
    !(selected.year() === end.year() && selected.month() === end.month())
      ? numberOfDaysInMonth + 1
      : end.date() + 1

  return R.range(from, to).map((day: any) => ({
    text:
      containsNow && now.date() === new PersianDate(startDate).add('days', day).date()
        ? 'امروز'
        : new PersianDate(start).add('days', day).format('D MMMM'),
    date: new PersianDate(start).add('days', day),
  }))
}

export const rangeOfValidHours = (startDate: Date, endDate: Date) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
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

export const rangeOfValidMinutes = (startDate: Date, endDate: Date) => {
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
  if (+start > +selected) return <div>invalid</div>
  if (+start > +end) return <div>invalid</div>
  if (+selected > +end) return <div>invalid</div>
  const [selectedDate, setSelectedDate] = useState(new PersianDate(selected))

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayValueChangeHandler = (newIndex: number) => {
    const { date } = rangeOfValidDays(start, end, selectedDate)[newIndex]
    const newDate = new PersianDate(
      selectedDate.date(date.date()).month(date.month())
    )
    setSelectedDate(newDate)
  }

  const onHourValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidHours(start, end)[newIndex]
    const newHour = toEnglishNumber(
      newValue.slice(newValue.indexOf('۰') === -1 ? 0 : newValue.indexOf('۰'))
    )
    const newDate = new PersianDate(selectedDate.hour(newHour))

    setSelectedDate(newDate)
  }

  const onMinuteValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidMinutes(start, end)[newIndex]
    const newMinute = toEnglishNumber(
      newValue.slice(newValue.indexOf('۰') === -1 ? 0 : newValue.indexOf('۰'))
    )
    const newDate = new PersianDate(selectedDate.minute(newMinute))
    setSelectedDate(newDate)
  }

  return (
    <Picker
      values={[
        {
          selectedItem: toLocale(
            String(selectedDate.minute()).padStart(2, '0')
          ),
          items: rangeOfValidMinutes(start, end),
          onUpdate: onMinuteValueChangeHandler,
        },
        {
          selectedItem: toLocale(String(selectedDate.hour()).padStart(2, '0')),
          items: rangeOfValidHours(start, end),
          onUpdate: onHourValueChangeHandler,
        },
        {
          selectedItem:
            selectedDate.date() === new PersianDate(new Date()).date()
              ? t('today')
              : selectedDate.format('D MMMM'),
          items: rangeOfValidDays(start, end, selectedDate).map(
            ({ text }) => text
          ),
          onUpdate: onDayValueChangeHandler,
        },
      ]}
    />
  )
}
