import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { DatePicker as GlobalDatePicker } from './date-picker'
import { ThemeProvider } from '@mui/material'
import { PersianDatePicker } from './persian-date-picker'
import { TimePicker as GlobalTimePicker } from './time-picker'
import { PersianTimePicker } from './persian-time-picker'
import '../setup/i18n/index'
import dayjs from 'dayjs'
export * from './picker'

interface Props {
  selected: Date
  start: Date
  end: Date
  onChange: (selectedDate: Date) => unknown
  theme?: unknown
  locale?: string
}

export function DatePicker({ theme, locale, ...props }: Props) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    i18next.changeLanguage(locale)
    dayjs.locale(locale)
    setIsReady(true)
  }, [locale])

  return (
    // @ts-ignore
    <ThemeProvider theme={theme}>
      {(locale || window.navigator.language).startsWith('fa') ? (
        <PersianDatePicker {...props} />
      ) : (
        <>{isReady && <GlobalDatePicker {...props} />}</>
      )}
    </ThemeProvider>
  )
}

export function TimePicker({ theme, locale, ...props }: Props) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    i18next.changeLanguage(locale)
    dayjs.locale(locale)
    setIsReady(true)
  }, [locale])

  return (
    // @ts-ignore
    <ThemeProvider theme={theme}>
      {(locale || window.navigator.language).startsWith('fa') ? (
        <PersianTimePicker {...props} />
      ) : (
        <> {isReady && <GlobalTimePicker {...props} />}</>
      )}
    </ThemeProvider>
  )
}
