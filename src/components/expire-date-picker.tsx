import * as R from 'ramda'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import i18next from 'i18next'
import { ThemeProvider } from '@weblite-wapps/ui-toolkit'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import { t } from '../setup/i18n'

dayjs.extend(localeData)
dayjs.extend(arraySupport)
dayjs.locale(i18next.language)

const rangeOfValidDays = () => {
  return Array(30)
    .fill('')
    .map((_, index) => ({
      text:
        index === 0 ? t('today') : dayjs().add(index, 'days').format('D MMMM'),
      date: dayjs().add(index, 'days'),
    }))
}

const rangeOfValidHours = (selectedDate: dayjs.Dayjs) => {
  const currentDate = dayjs(new Date())
  // The greatest range of picking days is just one month, so checking for the same day is sufficient.
  const startHour =
    selectedDate.date() === currentDate.date() ? currentDate.hour() : 0
  return R.range(startHour, 24)
    .map((number) => String(number).padStart(2, '0'))
    .map((number) => toLocale(number))
}

const rangeOfValidMinutes = (selectedDate: dayjs.Dayjs) => {
  const currentDate = dayjs(new Date())
  const startMinute =
    selectedDate.date() === currentDate.date() &&
    selectedDate.hour() === currentDate.hour()
      ? currentDate.minute()
      : 0
  return R.range(startMinute, 60)
    .map((number) => String(number).padStart(2, '0'))
    .map((number) => toLocale(number))
}

interface InviteLinkExpireDatePickerProps {
  onChange: (selectedDate: Date) => unknown
  defaultValue: Date
}

export function ExpireDatePicker({
  onChange,
  defaultValue,
}: InviteLinkExpireDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs(defaultValue))

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayValueChangeHandler = (newIndex: number) => {
    const { date } = rangeOfValidDays()[newIndex]
    const newDate = dayjs(selectedDate.date(date.date()).month(date.month()))
    setSelectedDate(newDate)
  }

  const onHourValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidHours(selectedDate)[newIndex]
    const newHour = toEnglishNumber(
      newValue.slice(
        newValue.indexOf(toLocale(0)) === -1 ? 0 : newValue.indexOf(toLocale(0))
      )
    )
    const newDate = dayjs(selectedDate.hour(+newHour))

    setSelectedDate(newDate)
  }

  const onMinuteValueChangeHandler = (newIndex: number) => {
    const newValue = rangeOfValidMinutes(selectedDate)[newIndex]
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
    <ThemeProvider>
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
            selectedItem: toLocale(
              String(selectedDate.hour()).padStart(2, '0')
            ),
            items: rangeOfValidHours(selectedDate),
            onUpdate: onHourValueChangeHandler,
          },
          {
            selectedItem:
              selectedDate.date() === dayjs(new Date()).date()
                ? t('today')
                : selectedDate.format('D MMMM'),
            items: rangeOfValidDays().map(({ text }) => text),
            onUpdate: onDayValueChangeHandler,
          },
        ]}
      />
    </ThemeProvider>
  )
}
