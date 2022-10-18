import * as R from 'ramda'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import i18next from 'i18next'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'

dayjs.extend(localeData)
dayjs.extend(arraySupport)

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

  if (start.year() === end.year())
    return months.slice(start.month(), end.month())

  if (end.year() - start.year() === 1)
    return months.slice(start.month()).concat(months.slice(0, end.month()))

  if (selected.year() === start.year()) return months.slice(start.month() - 1)

  if (selected.year() === end.year()) return months.slice(0, end.month())

  return months
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
    selected.month() === end.month() - 1 && selected.year() === end.year()
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

  i18next.on('languageChanged', (lng) => {
    dayjs.locale(lng)
  })

  useEffect(() => {
    onChange(selectedDate.add(selectedDate.utcOffset(), 'minutes').toDate())
  }, [selectedDate])

  const onYearChange = (newIndex: number) => {
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
    const { date } = getDaysRange(start, end, selectedDate)[newIndex]
    const newDate = dayjs([
      selectedDate.year(),
      selectedDate.month(),
      date.date(),
    ])
    setSelectedDate(newDate)
  }

  return (
    <Picker
      values={[
        {
          selectedItem: selectedDate.format('D'),
          items: getDaysRange(start, end, selectedDate).map(({ text }) => text),
          onUpdate: onDayChange,
        },
        {
          selectedItem: selectedDate.format('MMM'),
          items: getMonthsRange(start, end, selectedDate),
          onUpdate: onMonthChange,
        },
        {
          selectedItem: toLocale(dayjs(selected).year(), false),
          items: getYearsRange(start, end),
          onUpdate: onYearChange,
        },
      ]}
    />
  )
}
