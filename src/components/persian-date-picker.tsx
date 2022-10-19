import * as R from 'ramda'
import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PersianDate from 'persian-date'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'

const getYearsRange = (startDate: Date, endDate: Date) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
  return R.range(start.year(), end.year() + 1).map((number: any) =>
    toLocale(number, false)
  )
}

const getMonthsRange = (
  startDate: Date,
  endDate: Date,
  selected: typeof PersianDate
) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)
  const { months } = new PersianDate().rangeName()

  if (start.year() === end.year())
    return months.slice(start.month() - 1, end.month() - 1)

  if (end.year() - start.year() === 1)
    return months.slice(start.month()).concat(months.slice(0, end.month()))

  if (selected.year() === start.year()) return months.slice(start.month() - 1)

  if (selected.year() === end.year()) return months.slice(0, end.month())

  return months
}

const getDaysRange = (
  startDate: Date,
  endDate: Date,
  selected: typeof PersianDate
) => {
  const start = new PersianDate(startDate)
  const end = new PersianDate(endDate)

  const numberOfDaysInMonth = new PersianDate([
    selected.year(),
    selected.month(),
  ]).daysInMonth()

  const from =
    selected.month() === start.month() && selected.year() === start.year()
      ? start.date() - 1
      : 0
  const to =
    selected.month() === end.month() - 1 && selected.year() === end.year()
      ? end.date()
      : numberOfDaysInMonth + 1

  return R.range(1, numberOfDaysInMonth + 1)
    .slice(from, to)
    .map((day: any) => ({
      text: toLocale(day),
      date: new PersianDate(start).add('days', day),
    }))
}

interface PersianBirthdatePickerProps {
  selected: Date
  start: Date
  end: Date
  onChange: (selectedDate: Date) => unknown
}

export function PersianDatePicker({
  onChange,
  selected,
  start,
  end,
}: PersianBirthdatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(new PersianDate(selected))
  const [dayRange, setDayRange] = useState(
    getDaysRange(start, end, selectedDate)
  )

  useEffect(() => {
    onChange(new Date(selectedDate.subtract('minutes', selectedDate.zone())))
    setDayRange(getDaysRange(start, end, selectedDate))
  }, [selectedDate.toDate()])

  const onYearChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getYearsRange(start, end)[newIndex]
    console.log(newValue)
    const newYear = Number(toEnglishNumber(newValue))
    const daysInNewMonth = new PersianDate([
      newYear,
      selectedDate.month(),
    ]).daysInMonth()

    const newDay =
      daysInNewMonth < selectedDate.date()
        ? daysInNewMonth
        : selectedDate.date()

    const newDate = new PersianDate([newYear, selectedDate.month(), newDay])
    setSelectedDate(newDate)
  }

  const onMonthChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getMonthsRange(start, end, selectedDate)[newIndex]
    const { months } = new PersianDate().rangeName()
    const newMonth = months.indexOf(newValue) + 1
    const daysInNewMonth = new PersianDate([
      selectedDate.year(),
      newMonth,
    ]).daysInMonth()

    const newDay =
      daysInNewMonth < selectedDate.date()
        ? daysInNewMonth
        : selectedDate.date()

    const newDate = new PersianDate([selectedDate.year(), newMonth, newDay])
    setSelectedDate(newDate)
  }

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const { date } = getDaysRange(start, end, selectedDate)[newIndex]
    const newDate = new PersianDate([
      selectedDate.year(),
      selectedDate.month(),
      date.date(),
    ])
    setSelectedDate(newDate)
  }
  const parseSelected = () => {
    const yearValue = toLocale(selectedDate.year(), false)
    const yearIndex = getYearsRange(start, end).indexOf(yearValue)
    const monthValue = selectedDate.format('MMMM')
    const monthIndex = getMonthsRange(start, end, selectedDate).indexOf(
      monthValue
    )
    const dayValue = toLocale(selectedDate.date())
    const dayIndex = getDaysRange(start, end, selectedDate)
      .map(({ text }) => text)
      .indexOf(dayValue)
    return { yearIndex, monthIndex, dayIndex }
  }

  return (
    <Picker
      values={[
        {
          selectedIndex: parseSelected().dayIndex,
          items: dayRange.map(({ text }) => text),
          onUpdate: onDayChange,
        },
        {
          selectedIndex: parseSelected().monthIndex,
          items: getMonthsRange(start, end, selectedDate),
          onUpdate: onMonthChange,
        },
        {
          selectedIndex: parseSelected().yearIndex,
          items: getYearsRange(start, end),
          onUpdate: onYearChange,
        },
      ]}
    />
  )
}
