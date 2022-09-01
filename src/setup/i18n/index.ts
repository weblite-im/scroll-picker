import i18next, { TFunction } from 'i18next'
import 'dayjs/locale/ar'
import 'dayjs/locale/fa'
import { ar } from './ar'
import { fa } from './fa'
import { en } from './en'

i18next.init({
	lng: 'fa',
	debug: true,
	resources: { fa, ar, en },
})

export const t = i18next.t.bind(i18next) as TFunction | (() => TFunction) | any
