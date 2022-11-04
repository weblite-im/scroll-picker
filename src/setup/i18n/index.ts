import i18next, { TFunction } from 'i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/ar'
import 'dayjs/locale/fa'
import { ar } from './ar'
import { fa } from './fa'
import { en } from './en'

const i18n = i18next.createInstance()

i18n.init({ lng: 'fa', debug: true, resources: { fa, ar, en } })

i18n.on('languageChanged', (lng) => {
  dayjs.locale(lng)
})

export const t = i18n.t.bind(i18next) as TFunction | (() => TFunction) | any

export default i18n
