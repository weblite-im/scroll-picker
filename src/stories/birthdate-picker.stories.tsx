import { ComponentMeta, ComponentStory } from '@storybook/react'
import themeDecorator from './lib/theme-decorator'
import { boxDecorator } from './lib/box-decorator'
import { BirthdatePicker } from '..'

type TComponent = typeof BirthdatePicker

export default {
  title: 'Modals / Birthdate Picker',
  component: BirthdatePicker,
  decorators: [themeDecorator, boxDecorator()],
} as ComponentMeta<TComponent>

const Template: ComponentStory<TComponent> = (args) => (
  <BirthdatePicker {...args} />
)

export const Persian = Template.bind({})
Persian.args = {
  locale: 'fa',
  onChange: console.log,
  defaultValue: new Date(),
}

export const Arabic = Template.bind({})
Arabic.args = {
  locale: 'ar',
  onChange: console.log,
  defaultValue: new Date(),
}

export const English = Template.bind({})
English.args = {
  locale: 'en',
  onChange: console.log,
  defaultValue: new Date(),
}
