import * as R from 'ramda'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import i18next from 'i18next'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import { t } from '../setup/i18n'

dayjs.extend(localeData)
dayjs.extend(arraySupport)
dayjs.locale(i18next.language)

export const rangeOfValidDays = (
  startDate: Date,
  endDate: Date,
  selectedDate: Date
) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const selected = dayjs(selectedDate)
  const now = dayjs(new Date())
  const isLessThanOneMonth =
    start.year() === end.year() && start.month() === end.month()

  const numberOfDaysInMonth = dayjs([
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
      containsNow && now.date() === dayjs(startDate).add(day, 'days').date()
        ? 'امروز'
        : dayjs(start).add(day, 'days').format('D MMMM'),
    date: dayjs(start).add(day, 'days'),
  }))
}

export const rangeOfValidHours = (startDate: Date, endDate: Date) => {
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

export const rangeOfValidMinutes = (startDate: Date, endDate: Date) => {
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
  end
}: InviteLinkExpireDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs(selected))

  i18next.on('languageChanged', (lng) => {
    dayjs.locale(lng)
  })

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayValueChangeHandler = (newIndex: number) => {
    const { date } = rangeOfValidDays(start, end, selected)[newIndex]
    const newDate = dayjs(selectedDate.date(date.date()).month(date.month()))
    setSelectedDate(newDate)
  }

  const onHourValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidHours(start, end)[newIndex]
    const newHour = toEnglishNumber(
      newValue.slice(
        newValue.indexOf(toLocale(0)) === -1 ? 0 : newValue.indexOf(toLocale(0))
      )
    )
    const newDate = dayjs(selectedDate.hour(+newHour))

    setSelectedDate(newDate)
  }

  const onMinuteValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidMinutes(start, end)[newIndex]
    if (!newValue) return
    const newMinute = toEnglishNumber(
      newValue.slice(
        newValue.indexOf(toLocale(0)) === -1 ? 0 : newValue.indexOf(toLocale(0))
      )
    )
    const newDate = dayjs(selectedDate.minute(+newMinute))
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
            selectedDate.date() === dayjs(new Date()).date()
              ? t('today')
              : selectedDate.format('D MMMM'),
          items: rangeOfValidDays(start, end, selected).map(({ text }) => text),
          onUpdate: onDayValueChangeHandler,
        },
      ]}
    />
  )
}
