import { Route, Routes, BrowserRouter } from 'react-router-dom'
import * as Theme from './theme'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

/* pages */
import {
  Top,
  LoginCallback,
  Signup,
  UserTop,
  UserEdit,
  EvaluationDetail,
  EvaluationForm,
  UpdateLogin,
  UpdateCallback,
  Page404,
} from 'pages'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseStyle = require('./assets/style/base.css')
// グローバルスタイル設定
const GlobalStyle = createGlobalStyle`
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
            <Route path="/update/login" element={<UpdateLogin />} />
            <Route path="/update/callback" element={<UpdateCallback />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user/:id" element={<UserTop />} />
            <Route path="/evaluation/form/:evaluateeId" element={<EvaluationForm />} />
            <Route path="/evaluation/:evaluateeId/:evaluationId" element={<EvaluationDetail />} />
            <Route path="/user/edit/:id" element={<UserEdit />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
