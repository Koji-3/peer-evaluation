import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* lib, types */
import { get } from 'lib/axios'
import { DBUser } from 'types/types'

export const MypageTop: React.FC = () => {
  const [user, setUser] = useState<DBUser>()
  const { isLoading, isAuthenticated } = useAuth0()
  const params = useParams()

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      const res = await get<{ user: DBUser | null }>(`/user/${params.id}`)
      if (!res.user) {
        // TODO: データ取得失敗のアラート出す
        return
      }
      setUser(res.user)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <>
      <h1>{isAuthenticated ? 'ログイン中' : 'ログインしてない！'}</h1>
      <h1>名前：{user?.props.name}</h1>
      <h1>Auth0id: {user?.props.auth0_id}</h1>
      <a href={`/mypage/${params.id}/edit`}>編集ページへ</a>
    </>
  )
}
