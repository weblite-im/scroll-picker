import * as R from 'ramda'
import { useEffect, useState } from 'react'
// @ts-ignore
import PersianDate from 'persian-date'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import { t } from '../setup/i18n'

const rangeOfValidDays = () => {
  return Array(30)
    .fill('')
    .map((_, index) => ({
      text:
        index === 0
          ? t('today')
          : new PersianDate().add('days', index).format('D MMMM'),
      date: new PersianDate().add('days', index),
    }))
}

const rangeOfValidHours = (selectedDate: typeof PersianDate) => {
  const currentDate = new PersianDate(new Date())
  const startHour =
    selectedDate.date() === currentDate.date() ? currentDate.hour() : 0
  return R.range(startHour, 24)
    .map((number) => String(number).padStart(2, '0'))
    .map((number) => toLocale(number))
}

const rangeOfValidMinutes = (selectedDate: typeof PersianDate) => {
  const currentDate = new PersianDate(new Date())
  const startMinute =
    selectedDate.date() === currentDate.date() &&
    selectedDate.hour() === currentDate.hour()
      ? currentDate.minute()
      : 0
  return R.range(startMinute, 60)
    .map((number) => String(number).padStart(2, '0'))
    .map((number) => toLocale(number))
}

interface PersianExpireDatePickerProps {
  onChange: (selectedDate: Date) => unknown
}

export function PersianExpireDatePicker({
  onChange,
}: PersianExpireDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(new PersianDate(new Date()))

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayValueChangeHandler = (newIndex: number) => {
    const { date } = rangeOfValidDays()[newIndex]
    const newDate = new PersianDate(
      selectedDate.date(date.date()).month(date.month())
    )
    setSelectedDate(newDate)
  }

  const onHourValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidHours(selectedDate)[newIndex]
    const newHour = toEnglishNumber(
      newValue.slice(newValue.indexOf('۰') === -1 ? 0 : newValue.indexOf('۰'))
    )
    const newDate = new PersianDate(selectedDate.hour(newHour))

    setSelectedDate(newDate)
  }

  const onMinuteValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidMinutes(selectedDate)[newIndex]
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
          items: rangeOfValidMinutes(selectedDate),
          onUpdate: onMinuteValueChangeHandler,
        },
        {
          selectedItem: toLocale(String(selectedDate.hour()).padStart(2, '0')),
          items: rangeOfValidHours(selectedDate),
          onUpdate: onHourValueChangeHandler,
        },
        {
          selectedItem:
            selectedDate.date() === new PersianDate(new Date()).date()
              ? t('today')
              : selectedDate.format('D MMMM'),
          items: rangeOfValidDays().map(({ text }) => text),
          onUpdate: onDayValueChangeHandler,
        },
      ]}
    />
  )
}
