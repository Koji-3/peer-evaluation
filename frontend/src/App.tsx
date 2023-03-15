import { Route, Routes, BrowserRouter } from 'react-router-dom'
import * as Theme from './theme'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

/* libs, const, config */
import { mediaSp } from 'lib/media-query'

/* pages */
import { Top, LoginCallback, Signup, MypageTop } from 'pages'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseStyle = require('./assets/style/base.css')
// グローバルスタイル設定
const GlobalStyle = createGlobalStyle`
  .sp {
    display: none;
    ${mediaSp`
      display: block;
    `}
  }
  .pc {
    display: block;
    ${mediaSp`
      display: none;
    `}
  }
  ${baseStyle}
`

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={Theme.theme}>
      <GlobalStyle theme={Theme.theme} />
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Top />} />
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mypage/:id" element={<MypageTop />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
