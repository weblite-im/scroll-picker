import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import 'dayjs/locale/ar'
import i18next from 'i18next'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import {
  clampDate,
  getDaysOfMonthRange,
  getMonthsRange,
  getYearsRange,
} from '../helpers/dayjs.utils'

dayjs.extend(localeData)
dayjs.extend(arraySupport)
dayjs.locale(i18next.language)

interface BirthdatePickerProps {
  selected: Date
  start: Date
  end: Date
  onChange: (selectedDate: Date) => unknown
}

export function DatePicker({
  onChange,
  selected,
  start,
  end,
}: BirthdatePickerProps) {
  if (+start > +selected) return <div>invalid input</div>
  if (+start > +end) return <div>invalid input</div>
  if (+selected > +end) return <div>invalid input</div>
  const [selectedDate, setSelectedDate] = useState(dayjs(selected))

  useEffect(() => {
    onChange(selectedDate.add(selectedDate.utcOffset(), 'minutes').toDate())
  }, [selectedDate])

  const onYearChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getYearsRange(start, end)[newIndex]
    const newYear = toEnglishNumber(newValue)
    const newDate = dayjs([+newYear, selectedDate.month(), selectedDate.date()])
    setSelectedDate(clampDate(start, end, newDate))
  }

  const onMonthChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getMonthsRange(start, end, selectedDate)[newIndex]
    const months = dayjs.months()
    const newMonth = months.indexOf(newValue)
    const newDate = dayjs([selectedDate.year(), newMonth, selectedDate.date()])
    setSelectedDate(clampDate(start, end, newDate))
  }

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const { date } = getDaysOfMonthRange(start, end, selectedDate)[newIndex]
    const newDate = dayjs([
      selectedDate.year(),
      selectedDate.month(),
      date.date(),
    ])
    setSelectedDate(clampDate(start, end, newDate))
  }

  const parseSelected = useMemo(() => {
    const yearValue = toLocale(selectedDate.year(), false)
    const yearIndex = getYearsRange(start, end).indexOf(yearValue)
    const monthValue = selectedDate.format('MMMM')
    const monthIndex = getMonthsRange(start, end, selectedDate).indexOf(
      monthValue
    )
    const dayValue = toLocale(selectedDate.date())
    const dayIndex = getDaysOfMonthRange(start, end, selectedDate)
      .map(({ text }) => text)
      .indexOf(dayValue)
    return { yearIndex, monthIndex, dayIndex }
  }, [start, end, selectedDate])

  return (
    <Picker
      values={[
        {
          selectedIndex: parseSelected.dayIndex,
          items: getDaysOfMonthRange(start, end, selectedDate).map(
            ({ text }) => text
          ),
          onUpdate: onDayChange,
        },
        {
          selectedIndex: parseSelected.monthIndex,
          items: getMonthsRange(start, end, selectedDate),
          onUpdate: onMonthChange,
        },
        {
          selectedIndex: parseSelected.yearIndex,
          items: getYearsRange(start, end),
          onUpdate: onYearChange,
        },
      ]}
    />
  )
}
