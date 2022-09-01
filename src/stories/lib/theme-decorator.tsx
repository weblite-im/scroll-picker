import { ThemeProvider } from '@weblite-wapps/ui-toolkit'

export default function themeDecorator(Story: () => JSX.Element) {
  return <ThemeProvider>{Story()}</ThemeProvider>
}
