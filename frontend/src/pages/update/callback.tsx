/**
 * メールアドレス変更後のログイン後に認証メールを送信する。
 * メールアドレスを変更するとログアウトされてしまうので、メール認証後にsignupにリダイレクトしてしまう。
 */
import { useCallback, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Layout, LoginCallbackTpl } from 'components/templates'

/* lib, types, apis */
import { resendEmailVerification } from 'apis/user'
import { FlashMessage } from 'types/types'

export const UpdateCallback: React.FC = () => {
  const { getAccessTokenSilently, isLoading: isAuth0Loading } = useAuth0()
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const sendEmailVerification = useCallback(async (): Promise<void> => {
    const token = await getAccessTokenSilently()
    await resendEmailVerification(token)
  }, [getAccessTokenSilently])

  const onClickResend = async (): Promise<void> => {
    setIsLoading(true)
    setFlashMessage(undefined)
    try {
      await sendEmailVerification()
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
    if (isAuth0Loading) return
    ;(async () => {
      try {
        await sendEmailVerification()
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
      }
    })()
  }, [isAuth0Loading, sendEmailVerification])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined} isLoading={isAuth0Loading || isLoading}>
      {!isLoading && <LoginCallbackTpl onClickResend={onClickResend} />}
    </Layout>
  )
}
