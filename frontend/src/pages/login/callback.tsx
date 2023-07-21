/**
 * Auth0でログイン後にマイページへリダイレクトする用のファイル。
 * Auth0のコールバックに動的URLを設定できないため。
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* lib, types */
import { get } from 'lib/axios'
import { DBUser } from 'types/types'

export const LoginCallback: React.FC = () => {
  const { user, getAccessTokenSilently, isLoading } = useAuth0()
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false)
  const navigate = useNavigate()

  const getUserId = async (): Promise<string | null> => {
    const token = await getAccessTokenSilently()
    // Auth0のidからuserIdを取得する
    const res = await get<{ user: DBUser | null }>(`/user/auth/${user?.sub}`, token)

    return res.user?.key || null
  }

  useEffect(() => {
    setIsEmailVerified(user?.email_verified || false)
  }, [user])

  useEffect(() => {
    if (isLoading) return
    // TODO: Auth0のメール認証を行ってから使えるようにする
    if (!user || !user?.email_verified) return
    ;(async () => {
      const userId = await getUserId()
      if (!!user && !!userId) {
        navigate(`/user/${userId}`)
      } else {
        navigate('/signup')
      }
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user])

  return (
    // TODO: ローディング表示
    <>{!isLoading && !isEmailVerified ? <p>メール認証を行なってください</p> : <p>loading...</p>}</>
  )
}
