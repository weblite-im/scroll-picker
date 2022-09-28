import * as R from 'ramda'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import i18next from 'i18next'
import { ThemeProvider } from '@weblite-wapps/ui-toolkit'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'

dayjs.extend(localeData)
dayjs.extend(arraySupport)

const rangeOfValidYears = () => {
  const CENTURY = 100
  const currentDate = dayjs()
  const startDate = currentDate.year() - CENTURY
  const endDate = currentDate.year() + 1
  return R.range(startDate, endDate).map((number) => toLocale(number, false))
}

const rangeOfValidMonth = (selectedDate: dayjs.Dayjs) => {
  const currentDate = dayjs()
  const months = dayjs.months()
  return currentDate.year() === selectedDate.year()
    ? months.slice(0, currentDate.month() + 1)
    : months
}

const rangeOfValidDays = (selectedDate: dayjs.Dayjs) => {
  const currentDate = dayjs()
  const daysInMonth = dayjs([
    selectedDate.year(),
    selectedDate.month(),
  ]).daysInMonth()

  const isTheSameYearAndMonth =
    currentDate.year() === selectedDate.year() &&
    currentDate.month() === selectedDate.month()

  const lastDay = (isTheSameYearAndMonth ? currentDate.date() : daysInMonth) + 1

  return R.range(1, lastDay).map((day: number) => toLocale(day))
}

interface BirthdatePickerProps {
  onChange: (selectedDate: Date) => unknown
  defaultValue: Date
}

export function BirthdatePicker({
  onChange,
  defaultValue,
}: BirthdatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs(defaultValue))

  i18next.on('languageChanged', (lng) => {
    dayjs.locale(lng)
  })

  useEffect(() => {
    onChange(
      selectedDate.add(selectedDate.utcOffset(), 'minutes').toDate()
    )
  }, [selectedDate])

  const onYearValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidYears()[newIndex]
    const newYear = toEnglishNumber(newValue)
    const daysInNewMonth = dayjs([+newYear, selectedDate.month()]).daysInMonth()

    const newDay =
      daysInNewMonth < selectedDate.date()
        ? daysInNewMonth
        : selectedDate.date()

    const newDate = dayjs([+newYear, selectedDate.month(), newDay])
    setSelectedDate(newDate)
  }

  const onMonthValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidMonth(selectedDate)[newIndex]
    const months = dayjs.months()
    const newMonth = months.indexOf(newValue)
    const daysInNewMonth = dayjs([selectedDate.year(), newMonth]).daysInMonth()

    const newDay =
      daysInNewMonth < selectedDate.date()
        ? daysInNewMonth
        : selectedDate.date()

    const newDate = dayjs([selectedDate.year(), newMonth, newDay])
    setSelectedDate(newDate)
  }

  const onDayValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidDays(selectedDate)[newIndex]
    const newDay = Number(toEnglishNumber(newValue))
    const newDate = dayjs([selectedDate.year(), selectedDate.month(), newDay])
    setSelectedDate(newDate)
  }

  return (
    <ThemeProvider>
      <Picker
        values={[
          {
            selectedItem: toLocale(dayjs(defaultValue).date()),
            items: rangeOfValidDays(selectedDate),
            onUpdate: onDayValueChangeHandler,
          },
          {
            selectedItem: rangeOfValidMonth(dayjs(defaultValue))[
              dayjs(defaultValue).month()
            ],
            items: rangeOfValidMonth(selectedDate),
            onUpdate: onMonthValueChangeHandler,
          },
          {
            selectedItem: toLocale(dayjs(defaultValue).year(), false),
            items: rangeOfValidYears(),
            onUpdate: onYearValueChangeHandler,
          },
        ]}
      />
    </ThemeProvider>
  )
}
