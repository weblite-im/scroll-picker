import { ComponentMeta, ComponentStory } from '@storybook/react'
import { boxDecorator } from './lib/box-decorator'
import { DatePicker } from '..'

type TComponent = typeof DatePicker

export default {
  title: 'Modals / Date Picker',
  component: DatePicker,
  decorators: [boxDecorator()],
} as ComponentMeta<TComponent>

const Template: ComponentStory<TComponent> = (args) => <DatePicker {...args} />

export const Persian = Template.bind({})
Persian.args = {
  locale: 'fa',
  onChange: console.log,
  start: new Date(2022, 9, 1),
  selected: new Date(),
  end: new Date(2022, 11, 1),
}

export const Arabic = Template.bind({})
Arabic.args = {
  locale: 'ar',
  onChange: console.log,
  start: new Date(2022, 9, 1),
  selected: new Date(),
  end: new Date(2022, 11, 1),
}

export const English = Template.bind({})
English.args = {
  locale: 'en',
  onChange: console.log,
  start: new Date(2022, 9, 1),
  selected: new Date(),
  end: new Date(2022, 11, 1),
}
