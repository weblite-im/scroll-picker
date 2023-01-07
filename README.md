# Scroll Picker

The scroll picker package is a React picker component written in typescript. It's provide date/time picker components
and also has a common component for other logics.

## Installation

### yarn

`yarn add @web-lite/scroll-picker`

### npm

`npm i @web-lite/scroll-picker`

scroll picker exports two react component:
`TimePicker`
`DatePicker`
and also a common component named `Picker`

DatePicker has year-month-day format for picking date and TimePicker has day-hour-minute format. if you prefer other
format or another logic you can use Picker component and write your own logic for it.

## Localization

It's fully support i18n using `i18next` package. Also supports Jalali Calendar with the help of PersianDate package.
Other calendars and languages using DayJS package.

## Usage

```tsx
import { TimePicker } from '@web-lite/scroll-picker'

export function Picker() {
  return <TimePicker />
}

```

## Props

| Prop     | Description                   | Type                            |
|----------|-------------------------------|---------------------------------|
| start    | Start date of picker range    | Date                            |
| end      | End date of picker range      | Date                            |
| selected | Selected date of picker range | Date                            |
| onChange | Handle selected date change   | (selectedDate: Date) => unknown |
| locale   | String that localization      | string                          |



