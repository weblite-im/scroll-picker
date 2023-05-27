import { useEffect, useMemo, useState } from 'react'
// @ts-ignore
import PersianDate from 'persian-date'
import { toEnglishNumber, toLocale } from '../helpers/fuctions/text'
import { Picker } from './picker'
import {
  clampPersianDate,
  getPersianDaysRange,
  getPersianHoursRange,
  getPersianMinutesRange,
} from '../helpers/persian-date.utils'

interface PersianTimePickerProps {
  selected: Date
  start: Date
  end: Date
  onChange: (selectedDate: Date) => unknown
}

export function PersianTimePicker({
  selected,
  start,
  end,
  onChange,
}: PersianTimePickerProps) {
  if (+start > +selected) return <div>invalid input</div>
  if (+start > +end) return <div>invalid input</div>
  if (+selected > +end) return <div>invalid input</div>
  const [selectedDate, setSelectedDate] = useState(new PersianDate(selected))

  useEffect(() => {
    onChange(selectedDate.toDate())
  }, [selectedDate])

  const onDayChange = (newIndex: number) => {
    if (newIndex === -1) return
    const dayRange = getPersianDaysRange(start, end)
    const index = dayRange
      .map(({ text }) => text)
      .indexOf(parseSelected.dayRange[newIndex])
    const { date } = dayRange[index]
    const newDate = new PersianDate(
      selectedDate.date(date.date()).month(date.month()).year(date.year())
    )
    setSelectedDate(clampPersianDate(start, end, newDate))
  }

  const onHourChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getPersianHoursRange(start, end, selectedDate)[newIndex]
    const newHour = toEnglishNumber(newValue)
    const newDate = new PersianDate(selectedDate.hour(+newHour))
    setSelectedDate(clampPersianDate(start, end, newDate))
  }

  const onMinuteChange = (newIndex: number) => {
    if (newIndex === -1) return
    const newValue = getPersianMinutesRange(start, end, selectedDate)[newIndex]
    const newMinute = toEnglishNumber(newValue)
    const newDate = new PersianDate(selectedDate.minute(+newMinute))
    setSelectedDate(clampPersianDate(start, end, newDate))
  }

  const parseSelected = useMemo(() => {
    const minuteValue = toLocale(String(selectedDate.minute()).padStart(2, '0'))
    const minuteRange = getPersianMinutesRange(start, end, selectedDate)
    const minuteIndex = minuteRange.indexOf(minuteValue)

    const hourValue = toLocale(String(selectedDate.hour()).padStart(2, '0'))
    const hourRange = getPersianHoursRange(start, end, selectedDate)
    const hourIndex = hourRange.indexOf(hourValue)

    const dayValue = selectedDate.format('D MMMM')
    const tempDayRange = getPersianDaysRange(start, end).map(({ text }) => text)
    const tempDayIndex = tempDayRange.indexOf(dayValue)
    const dayRange = tempDayRange.slice(
      Math.max(0, tempDayIndex - 15),
      tempDayIndex + 15
    )
    const dayIndex = dayRange.indexOf(dayValue)

    return {
      minuteIndex,
      hourIndex,
      dayIndex,
      minuteRange,
      hourRange,
      dayRange,
    }
  }, [selectedDate, end, start])

  return (
    <Picker
      values={[
        {
          selectedIndex: parseSelected.minuteIndex,
          items: parseSelected.minuteRange,
          onUpdate: onMinuteChange,
        },
        {
          selectedIndex: parseSelected.hourIndex,
          items: parseSelected.hourRange,
          onUpdate: onHourChange,
        },
        {
          selectedIndex: parseSelected.dayIndex,
          items: parseSelected.dayRange,
          onUpdate: onDayChange,
        },
      ]}
    />
  )
}
