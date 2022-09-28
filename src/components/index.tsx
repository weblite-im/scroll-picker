import { useEffect } from 'react'
import i18next from 'i18next'
import { BirthdatePicker as GlobalBirthdatePicker } from './birthdate-picker'
import { PersianBirthdatePicker } from './persian-birthdate-picker'

import { ExpireDatePicker as GlobalExpireDatePicker } from './expire-date-picker'
import { PersianExpireDatePicker } from './persian-expire-date-picker'

export * from './picker'

interface Props {
  onChange: (selectedDate: Date) => unknown
  defaultValue: Date
  locale?: string
}

export function BirthdatePicker({ locale, ...props }: Props) {
  useEffect(() => {
    i18next.changeLanguage(locale).then(console.log)
  }, [locale])
  return (locale || window.navigator.language).startsWith('fa') ? (
    <PersianBirthdatePicker {...props} />
  ) : (
    <GlobalBirthdatePicker {...props} />
  )
}

export function ExpireDatePicker({ locale, ...props }: Props) {
  useEffect(() => {
    i18next.changeLanguage(locale)
  }, [locale])
  return (locale || window.navigator.language).startsWith('fa') ? (
    <PersianExpireDatePicker {...props} />
  ) : (
    <GlobalExpireDatePicker {...props} />
  )
}
