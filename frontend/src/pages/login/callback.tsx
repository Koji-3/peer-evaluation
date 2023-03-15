/**
 * Auth0でログイン後にマイページへリダイレクトする用のファイル。
 * Auth0のコールバックに動的URLを設定できないため。
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* lib, types */
import { get } from 'lib/fetch-api'
import { DBUser } from 'types/types'

export const LoginCallback: React.FC = () => {
  const { user, getAccessTokenSilently, isLoading } = useAuth0()
  const navigate = useNavigate()

  const getUserId = async (): Promise<string | null> => {
    const token = await getAccessTokenSilently()
    const res = await get<{ user: DBUser | null }>(`/user/auth/${user?.sub}`, token)

    return res.user?.key || null
  }

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      const userId = await getUserId()
      if (!!user && !!userId) {
        navigate(`/mypage/${userId}`)
      } else {
        navigate('/signup')
      }
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user])

  // TODO: ローディング表示
  return <></>
}
