import { Route, Routes, BrowserRouter } from 'react-router-dom'
import * as Theme from './theme'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

/* pages */
import {
  Top,
  LoginCallback,
  EmailVerificationCallback,
  Signup,
  UserTop,
  UserEdit,
  EvaluationDetail,
  EvaluationForm,
  UpdateLogin,
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
            <Route path="/update/login" element={<UpdateLogin />} />

            <Route path="/user/:id" element={<UserTop />} />
            <Route path="/evaluation/form/:evaluateeId" element={<EvaluationForm />} />
            <Route path="/evaluation/:evaluateeId/:evaluationId" element={<EvaluationDetail />} />
            <Route path="/user/edit/:id" element={<UserEdit />} />
            {/* Auth0のログインからのコールバック */}
            <Route path="/login/callback" element={<LoginCallback />} />
            {/* Auth0のメール認証からのコールバック */}
            <Route path="/signup" element={<EmailVerificationCallback />} />
            <Route path="/signup/new" element={<Signup />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
