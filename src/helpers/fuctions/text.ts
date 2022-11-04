import i18next from '../../setup/i18n'

export const toLocale = (text: string | number, useGrouping = true) => {
  if (typeof text === 'number')
    return text.toLocaleString(i18next.language, {
      useGrouping,
    })
  return text.replace(/\d/g, (num) =>
    parseInt(num, 10).toLocaleString(i18next.language, {
      useGrouping,
    })
  )
}

// arabic and persian
const ar = '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹'.split('')
const en = '01234567890123456789'.split('')
// TODO #optimize
export const toEnglishNumber = (strNum: string) => {
  return strNum
    .replace(/[٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹]/g, (x) => en[ar.indexOf(x)])
    .replace(/\D/g, '')
}
