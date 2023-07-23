import { Route, Routes, BrowserRouter } from 'react-router-dom'
import * as Theme from './theme'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

/* libs, const, config */
import { mediaSp } from 'lib/media-query'

/* pages */
import { Top, LoginCallback, Signup, UserTop, UserEdit, EvaluationDetail, EvaluationForm } from 'pages'

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
            <Route path="/user/:id" element={<UserTop />} />
            <Route path="/evaluation/form/:evaluateeId" element={<EvaluationForm />} />
            <Route path="/evaluation/:evaluateeId/:evaluationId" element={<EvaluationDetail />} />
            <Route path="/user/:id/edit" element={<UserEdit />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
