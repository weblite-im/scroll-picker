import * as R from 'ramda'
import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PersianDate from 'persian-date'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'

const rangeOfValidYears = () => {
  const CENTURY = 100
  const currentDate = new PersianDate()
  const startDate = currentDate.year() - CENTURY
  const endDate = currentDate.year() + 1
  return R.range(startDate, endDate).map((number) => toLocale(number, false))
}

const rangeOfValidMonth = (selectedDate: typeof PersianDate) => {
  const currentDate = new PersianDate()
  const { months } = new PersianDate().rangeName()
  return currentDate.year() === selectedDate.year()
    ? months.slice(0, currentDate.month())
    : months
}

const rangeOfValidDays = (selectedDate: typeof PersianDate) => {
  const currentDate = new PersianDate()
  const daysInMonth = new PersianDate([
    selectedDate.year(),
    selectedDate.month(),
  ]).daysInMonth()

  const isTheSameYearAndMonth =
    currentDate.year() === selectedDate.year() &&
    currentDate.month() === selectedDate.month()

  const lastDay = (isTheSameYearAndMonth ? currentDate.date() : daysInMonth) + 1

  return R.range(1, lastDay).map((day: number) => toLocale(day))
}

interface PersianBirthdatePickerProps {
  onChange: (selectedDate: Date) => unknown
  defaultValue: Date
}

export function PersianBirthdatePicker({
  onChange,
  defaultValue,
}: PersianBirthdatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(
    new PersianDate(defaultValue)
  )

  useEffect(() => {
    onChange(new Date(selectedDate.subtract('minutes', selectedDate.zone())))
  }, [selectedDate])

  const onYearValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidYears()[newIndex]
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

  const onMonthValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidMonth(selectedDate)[newIndex]
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

  const onDayValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidDays(selectedDate)[newIndex]
    const newDay = Number(toEnglishNumber(newValue))
    const newDate = new PersianDate([
      selectedDate.year(),
      selectedDate.month(),
      newDay,
    ])
    setSelectedDate(newDate)
  }

  return (
    <Picker
      values={[
        {
          selectedItem: toLocale(selectedDate.year(), false),
          items: rangeOfValidYears(),
          onUpdate: onYearValueChangeHandler,
        },
        {
          selectedItem:
            rangeOfValidMonth(selectedDate)[selectedDate.month() - 1],
          items: rangeOfValidMonth(selectedDate),
          onUpdate: onMonthValueChangeHandler,
        },
        {
          selectedItem: toLocale(selectedDate.date()),
          items: rangeOfValidDays(selectedDate),
          onUpdate: onDayValueChangeHandler,
        },
      ]}
    />
  )
}
