import * as R from 'ramda'
import { useEffect, useState} from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import 'dayjs/locale/ar'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import i18next from 'i18next'

dayjs.extend(localeData)
dayjs.extend(arraySupport)
dayjs.locale(i18next.language)

const getYearsRange = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  return R.range(start.year(), end.year() + 1).map((number: any) =>
    toLocale(number, false)
  )
}

const getMonthsRange = (
  startDate: Date,
  endDate: Date,
  selected: dayjs.Dayjs
) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const months = dayjs.months()

  const startMonth = selected.year() === start.year() ? start.month() - 1 : 0
  const endMonth = selected.year() === end.year() ? end.month() : undefined
  return months.slice(startMonth, endMonth)
}

const getDaysRange = (
  startDate: Date,
  endDate: Date,
  selected: dayjs.Dayjs
) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  const numberOfDaysInMonth = dayjs([
    selected.year(),
    selected.month(),
  ]).daysInMonth()

  const from =
    selected.month() === start.month() && selected.year() === start.year()
      ? start.date() - 1
      : 0
  const to =
    selected.month() === end.month() && selected.year() === end.year()
      ? end.date()
      : numberOfDaysInMonth + 1

  return R.range(1, numberOfDaysInMonth + 1)
    .slice(from, to)
    .map((day: any) => ({
      text: toLocale(day),
      date: dayjs(start).add(day, 'days'),
    }))
}

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
    const daysInNewMonth = dayjs([+newYear, selectedDate.month()]).daysInMonth()

    const newDay =
      daysInNewMonth < selectedDate.date()
        ? daysInNewMonth
        : selectedDate.date()

    const newDate = dayjs([+newYear, selectedDate.month(), newDay])
    setSelectedDate(newDate)
  }

  const onMonthChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getMonthsRange(start, end, selectedDate)[newIndex]
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

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const { date } = getDaysRange(start, end, selectedDate)[newIndex]
    const newDate = dayjs([
      selectedDate.year(),
      selectedDate.month(),
      date.date(),
    ])
    setSelectedDate(newDate)
  }

  const parseSelected = () => {
    const yearValue = toLocale(selectedDate.year(), false)
    const yearIndex = getYearsRange(start, end).indexOf(yearValue)
    const monthValue = selectedDate.format('MMM')
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
          items: getDaysRange(start, end, selectedDate).map(({ text }) => text),
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
