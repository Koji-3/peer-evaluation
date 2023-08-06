/**
 * Auth0でログイン後にマイページへリダイレクトする用のファイル。
 * Auth0のコールバックに動的URLを設定できないため。
 */
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Layout, LoginCallbackTpl } from 'components/templates'

/* lib, types, apis */
import { fetchUserByAuth0Id, resendEmailVerification } from 'apis/user'
import { FlashMessage } from 'types/types'

export const LoginCallback: React.FC = () => {
  const { user: auth0User, getAccessTokenSilently, isLoading: isAuth0Loading } = useAuth0()
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false)
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const getUserId = useCallback(async (): Promise<string | undefined> => {
    try {
      const token = await getAccessTokenSilently()
      // Auth0のidからuserIdを取得する
      const user = await fetchUserByAuth0Id(token)
      return user?.key
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
    }
  }, [getAccessTokenSilently])

  const onClickResend = async (): Promise<void> => {
    setIsLoading(true)
    setFlashMessage(undefined)
    const token = await getAccessTokenSilently()
    try {
      await resendEmailVerification(token)
      setIsLoading(false)
      setFlashMessage({ type: 'success', message: 'メールを再送しました。' })
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  useEffect(() => {
    setIsEmailVerified(auth0User?.email_verified || false)
  }, [auth0User])

  useEffect(() => {
    if (isAuth0Loading) return
    // Auth0のメール認証を行ってから使えるようにする
    if (!auth0User || !auth0User?.email_verified) return
    ;(async () => {
      try {
        const userId = await getUserId()
        setIsLoading(false)
        if (!!auth0User && !!userId) {
          navigate(`/user/${userId}`)
        } else {
          navigate('/signup')
        }
      } catch (e) {
        setIsLoading(false)
      }
    })()
  }, [isAuth0Loading, auth0User, navigate, getAccessTokenSilently, getUserId])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined} isLoading={isAuth0Loading || isLoading}>
      {!isEmailVerified && <LoginCallbackTpl onClickResend={onClickResend} />}
    </Layout>
  )
}
