import { BirthdatePicker as GlobalBirthdatePicker } from './birthdate-picker'
import { PersianBirthdatePicker } from './persian-birthdate-picker'

import { ExpireDatePicker as GlobalExpireDatePicker } from './expire-date-picker'
import { PersianExpireDatePicker } from './persian-expire-date-picker'
import i18next from 'i18next'
import { useEffect } from 'react'

export * from './picker'

interface Props {
  onChange: () => unknown
  defaultValue: Date
  locale?: string
}

export function BirthdatePicker({ locale, ...props }: Props) {
  useEffect(() => {
    i18next.changeLanguage(locale)
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
