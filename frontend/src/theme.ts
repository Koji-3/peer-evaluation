import 'styled-components'

export const theme = {
  white: '#fff',
  black: '#000',
  borderGray: '#bababa',
  dividerGray: '#b9b9b9',
  inactiveGray: '#adadad',
  placeholderRgba: '0, 0, 0, 0.2',
  primary: '#53bd9a',
  primaryRgb: '83,189,154',
  darkGreen: '#31565d',
  background: '#f8ece1',
} as const

type Theme = typeof theme
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
