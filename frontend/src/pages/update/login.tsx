/**
 * メールアドレス変更後に新しいメールアドレスでログインするためのページ。
 * メールアドレスを変更するとログアウトされてしまうので、メール認証後にsignupにリダイレクトしてしまう。
 */
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Layout, UpdateLoginTpl } from 'components/templates'

export const UpdateLogin: React.FC = () => {
  const { loginWithRedirect } = useAuth0()

  const onClickLogin = (): void => {
    loginWithRedirect()
  }

  return (
    <Layout>
      <UpdateLoginTpl onClickLogin={onClickLogin} />
    </Layout>
  )
}
