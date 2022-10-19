import { ComponentMeta, ComponentStory } from '@storybook/react'
import { boxDecorator } from './lib/box-decorator'
import { TimePicker } from '..'

type TComponent = typeof TimePicker

export default {
  title: 'Modals / Time Picker',
  component: TimePicker,
  decorators: [boxDecorator()],
} as ComponentMeta<TComponent>

const Template: ComponentStory<TComponent> = (args) => <TimePicker {...args} />

export const Persian = Template.bind({})
Persian.args = {
  locale: 'fa',
  onChange: () => {},
  start: new Date(2022, 9, 1),
  selected: new Date(),
  end: new Date(2022, 11, 1),
}

export const Arabic = Template.bind({})
Arabic.args = {
  locale: 'ar-IQ',
  onChange: () => {},
  start: new Date(2022, 9, 1),
  selected: new Date(),
  end: new Date(2022, 11, 1),
}

export const English = Template.bind({})
English.args = {
  locale: 'en',
  onChange: () => {},
  start: new Date(2022, 9, 1),
  selected: new Date(),
  end: new Date(2022, 11, 1),
}
