import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

type Props = {
  children?: React.ReactNode
}

export const AuthWrapper: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      // TODO: ログインしてください的なアラート表示する
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return <>{children}</>
}
