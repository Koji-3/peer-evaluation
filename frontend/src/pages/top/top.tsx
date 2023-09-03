import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Layout, TopTpl } from 'components/templates'

/* lib, types, apis */
import { FlashMessage } from 'types/types'

export const Top: React.FC = () => {
  const location = useLocation()
  const { loginWithRedirect } = useAuth0()
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const navigate = useNavigate()

  const signup = (): void => {
    loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
  }

  useEffect(() => {
    if (location.state && location.state.flashMessage) {
      setFlashMessage(location.state.flashMessage)

      setTimeout(() => {
        // リロードするとstateが残ってしまうので、遷移後すぐにstateを削除する
        navigate(location.pathname, { replace: true })
      }, 300)
    }
  }, [location.pathname, location.state, navigate])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined}>
      <TopTpl signup={signup} />
    </Layout>
  )
}
