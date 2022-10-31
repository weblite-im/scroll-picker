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

const dates = {
  start: new Date(Date.now() + 2 * 24 * 3600_000),
  selected: new Date(Date.now() + 2 * 24 * 3600_000 + 1000),
  end: new Date(Date.now() + 4 * 24 * 3600_000),
}

export const Persian = Template.bind({})
Persian.args = {
  locale: 'fa',
  onChange: () => {},
  ...dates,
}

export const Arabic = Template.bind({})
Arabic.args = {
  locale: 'ar-IQ',
  onChange: () => {},
  ...dates,
}

export const English = Template.bind({})
English.args = {
  locale: 'en',
  onChange: () => {},
  ...dates,
}
