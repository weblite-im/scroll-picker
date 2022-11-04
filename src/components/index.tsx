import { useEffect } from 'react'
import i18next from '../setup/i18n'
import { DatePicker as GlobalDatePicker } from './date-picker'
import { ThemeProvider } from '@mui/material'
import { PersianDatePicker } from './persian-date-picker'
import { TimePicker as GlobalTimePicker } from './time-picker'
import { PersianTimePicker } from './persian-time-picker'
import '../setup/i18n/index'
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
  useEffect(() => {
    i18next.changeLanguage(locale)
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
