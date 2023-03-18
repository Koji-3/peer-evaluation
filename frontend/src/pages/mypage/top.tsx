import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { AuthWrapper } from 'components/templates'

/* lib, types */
import { get } from 'lib/axios'
import { DBUser } from 'types/types'

export const MypageTop: React.FC = () => {
  const [user, setUser] = useState<DBUser | null>()
  const { isLoading, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      const token = await getAccessTokenSilently()
      const res = await get<{ user: DBUser | null }>(`/user`, token)
      setUser(res.user)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <>
      <AuthWrapper>
        <h1>名前：{user?.props.name}</h1>
        <h1>Auth0id: {user?.props.auth0_id}</h1>
      </AuthWrapper>
    </>
  )
}
