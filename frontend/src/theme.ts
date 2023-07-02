import 'styled-components'

export const theme = {
  white: '#fff',
  black: '#000',
  borderGray: '#bababa',
  placeholderRgb: '0, 0, 0, 0.2',
  primary: '#53bd9a',
  darkGreen: '#31565d',
} as const

type Theme = typeof theme
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
