/**
 * Auth0でログイン後にマイページへリダイレクトする用のファイル。
 * Auth0のコールバックに動的URLを設定できないため。
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Layout, LoginCallbackTpl } from 'components/templates'

/* lib, types, apis */
import { fetchUserByAuth0Id, resendEmailVerification } from 'apis/user'

export const LoginCallback: React.FC = () => {
  const { user: auth0User, getAccessTokenSilently, isLoading } = useAuth0()
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false)
  const navigate = useNavigate()

  const getUserId = async (): Promise<string | undefined> => {
    try {
      const token = await getAccessTokenSilently()
      // Auth0のidからuserIdを取得する
      const user = await fetchUserByAuth0Id(token)
      return user?.key
    } catch (e) {
      // TODO: エラー処理
    }
  }

  const onClickResend = async (): Promise<void> => {
    const token = await getAccessTokenSilently()
    try {
      await resendEmailVerification(token)
    } catch (e) {
      // TODO: エラー処理
    }
  }

  useEffect(() => {
    setIsEmailVerified(auth0User?.email_verified || false)
  }, [auth0User])

  useEffect(() => {
    if (isLoading) return
    // Auth0のメール認証を行ってから使えるようにする
    if (!auth0User || !auth0User?.email_verified) return
    ;(async () => {
      const userId = await getUserId()
      if (!!auth0User && !!userId) {
        navigate(`/user/${userId}`)
      } else {
        navigate('/signup')
      }
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, auth0User])

  return (
    // TODO: ローディング表示
    <Layout>
      {isLoading && <p>loading...</p>}
      {!isEmailVerified && <LoginCallbackTpl onClickResend={onClickResend} />}
    </Layout>
  )
}
