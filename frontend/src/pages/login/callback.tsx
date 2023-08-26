/**
 * Auth0でログイン後にマイページ or 新規登録ページへリダイレクトする用のファイル。
 * Auth0のコールバックに動的URLを設定できないため。
 */
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { LoadingTpl } from 'components/templates'

/* lib, types, apis */
import { fetchUserByAuth0Id } from 'apis/user'

export const LoginCallback: React.FC = () => {
  const { user: auth0User, getAccessTokenSilently, isLoading: isAuth0Loading } = useAuth0()
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

  useEffect(() => {
    if (isAuth0Loading) return
    ;(async () => {
      const userId = await getUserId()
      if (!!auth0User && !!userId) {
        navigate(`/user/${userId}`)
      } else {
        navigate('/signup/new')
      }
    })()
  }, [isAuth0Loading, auth0User, navigate, getAccessTokenSilently, getUserId])

  return <LoadingTpl />
}
