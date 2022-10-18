import { useEffect } from 'react'
import i18next from 'i18next'
import { DatePicker as GlobalDatePicker } from './date-picker'
import { PersianDatePicker } from './persian-date-picker'

import { TimePicker as GlobalTimePicker } from './time-picker'
import { PersianTimePicker } from './persian-time-picker'
import { ThemeProvider } from '@mui/material'

export * from './picker'

interface Props {
  onChange: (selectedDate: Date) => unknown
  selected: Date
  start: Date
  end: Date
  theme: unknown
  locale?: string
}

export function DatePicker({ theme, locale, ...props }: Props) {
  useEffect(() => {
    i18next.changeLanguage(locale).then(console.log)
  }, [locale])
  return (
    // @ts-ignore
    <ThemeProvider theme={theme}>
      {(locale || window.navigator.language).startsWith('fa') ? (
        <PersianDatePicker {...props} />
      ) : (
        <GlobalDatePicker {...props} />
      )}
    </ThemeProvider>
  )
}

export function TimePicker({ theme, locale, ...props }: Props) {
  useEffect(() => {
    i18next.changeLanguage(locale)
  }, [locale])
  return (
    // @ts-ignore
    <ThemeProvider theme={theme}>
      {(locale || window.navigator.language).startsWith('fa') ? (
        <PersianTimePicker {...props} />
      ) : (
        <GlobalTimePicker {...props} />
      )}
    </ThemeProvider>
  )
}
