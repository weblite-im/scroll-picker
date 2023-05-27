import { useEffect, useMemo, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PersianDate from 'persian-date'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import {
  clampPersianDate,
  getPersianDaysOfMonthRange,
  getPersianMonthsRange,
  getPersianYearsRange,
} from '../helpers/persian-date.utils'

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
    getPersianDaysOfMonthRange(start, end, selectedDate)
  )

  useEffect(() => {
    onChange(new Date(selectedDate.subtract('minutes', selectedDate.zone())))
    setDayRange(getPersianDaysOfMonthRange(start, end, selectedDate))
  }, [selectedDate.toDate()])

  const onYearChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getPersianYearsRange(start, end)[newIndex]
    const newYear = Number(toEnglishNumber(newValue))
    const newDate = new PersianDate([
      newYear,
      selectedDate.month(),
      selectedDate.date(),
    ])
    setSelectedDate(clampPersianDate(start, end, newDate))
  }

  const onMonthChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getPersianMonthsRange(start, end, selectedDate)[newIndex]
    const { months } = new PersianDate().rangeName()
    const newMonth = months.indexOf(newValue) + 1
    const newDate = new PersianDate([
      selectedDate.year(),
      newMonth,
      selectedDate.date(),
    ])

    setSelectedDate(clampPersianDate(start, end, newDate))
  }

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const { date } = getPersianDaysOfMonthRange(start, end, selectedDate)[
      newIndex
    ]
    const newDate = new PersianDate([
      selectedDate.year(),
      selectedDate.month(),
      date.date(),
    ])
    setSelectedDate(clampPersianDate(start, end, newDate))
  }

  const parseSelected = useMemo(() => {
    const yearValue = toLocale(selectedDate.year(), false)
    const yearIndex = getPersianYearsRange(start, end).indexOf(yearValue)
    const monthValue = selectedDate.format('MMMM')
    const monthIndex = getPersianMonthsRange(start, end, selectedDate).indexOf(
      monthValue
    )
    const dayValue = toLocale(selectedDate.date())
    const dayIndex = getPersianDaysOfMonthRange(start, end, selectedDate)
      .map(({ text }) => text)
      .indexOf(dayValue)

    return { yearIndex, monthIndex, dayIndex }
  }, [start, end, selectedDate])

  return (
    <Picker
      items={['روز', 'ماه', 'سال']}
      values={[
        {
          selectedIndex: parseSelected.dayIndex,
          items: dayRange.map(({ text }) => text),
          onUpdate: onDayChange,
        },
        {
          selectedIndex: parseSelected.monthIndex,
          items: getPersianMonthsRange(start, end, selectedDate),
          onUpdate: onMonthChange,
        },
        {
          selectedIndex: parseSelected.yearIndex,
          items: getPersianYearsRange(start, end),
          onUpdate: onYearChange,
        },
      ]}
    />
  )
}
