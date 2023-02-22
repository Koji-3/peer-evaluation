/**
 * Auth0でログイン後にマイページへリダイレクトする用のファイル。
 * Auth0のコールバックに動的URLを設定できないため。
 */
import { useAuth0 } from '@auth0/auth0-react'

export const LoginRedirect: React.FC = () => {
  const { user } = useAuth0()
  console.log(user?.sub)
  // TODO: user.subからidを生成してDBにユーザーのデータ作る
  return <></>
}
