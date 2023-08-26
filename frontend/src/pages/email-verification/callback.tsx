/**
 * Auth0のメールアドレス認証メールの「認証」ボタンのコールバックページ
 * Auth0の設定的に/signupにコールバックされる
 */
/* components */
import { Layout, EmailVerificationCallbackTpl } from 'components/templates'

export const EmailVerificationCallback: React.FC = () => {
  return (
    <Layout>
      <EmailVerificationCallbackTpl />
    </Layout>
  )
}
