import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import {
  clampDate,
  getDaysRange,
  getHoursRange,
  getMinutesRange,
} from '../helpers/dayjs.utils'

dayjs.extend(localeData)
dayjs.extend(arraySupport)

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
  end,
}: InviteLinkExpireDatePickerProps) {
  if (+start > +selected) return <div>invalid input</div>
  if (+start > +end) return <div>invalid input</div>
  if (+selected > +end) return <div>invalid input</div>
  const [selectedDate, setSelectedDate] = useState(dayjs(selected))

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const { date } = getDaysRange(start, end)[newIndex]
    const newDate = dayjs(selectedDate.date(date.date()).month(date.month()))
    setSelectedDate(clampDate(start, end, newDate))
  }

  const onHourChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getHoursRange(start, end, selectedDate)[newIndex]
    const newHour = toEnglishNumber(newValue)
    const newDate = dayjs(selectedDate.hour(+newHour))
    setSelectedDate(clampDate(start, end, newDate))
  }

  const onMinuteChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getMinutesRange(start, end, selectedDate)[newIndex]
    if (!newValue) return
    const newMinute = toEnglishNumber(newValue)
    const newDate = dayjs(selectedDate.minute(+newMinute))
    setSelectedDate(clampDate(start, end, newDate))
  }

  const parseSelected = useMemo(() => {
    const minuteValue = toLocale(String(selectedDate.minute()).padStart(2, '0'))
    const minuteIndex = getMinutesRange(start, end, selectedDate).indexOf(
      minuteValue
    )
    const hourValue = toLocale(String(selectedDate.hour()).padStart(2, '0'))
    const hourIndex = getHoursRange(start, end, selectedDate).indexOf(hourValue)
    const dayValue = toLocale(selectedDate.format('D MMMM'))
    const dayIndex = getDaysRange(start, end)
      .map(({ text }) => text)
      .indexOf(dayValue)
    return { minuteIndex, hourIndex, dayIndex }
  }, [start, end, selectedDate])

  return (
    <Picker
      values={[
        {
          selectedIndex: parseSelected.minuteIndex,
          items: getMinutesRange(start, end, selectedDate),
          onUpdate: onMinuteChange,
        },
        {
          selectedIndex: parseSelected.hourIndex,
          items: getHoursRange(start, end, selectedDate),
          onUpdate: onHourChange,
        },
        {
          selectedIndex: parseSelected.dayIndex,
          items: getDaysRange(start, end).map(({ text }) => text),
          onUpdate: onDayChange,
        },
      ]}
    />
  )
}
