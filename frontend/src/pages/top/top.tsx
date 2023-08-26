import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Button } from 'components/atoms'
import { Layout } from 'components/templates'

/* lib, types, apis */
import { FlashMessage } from 'types/types'

export const Top: React.FC = () => {
  const location = useLocation()
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const navigate = useNavigate()

  useEffect(() => {
      if(location.state && location.state.flashMessage) {
        setFlashMessage(location.state.flashMessage)

        setTimeout(() => {
          // リロードするとstateが残ってしまうので、リロード後にstateを削除する
          navigate(location.pathname, {replace: true})
        }, 6000)
      }
  }, [location.pathname, location.state, navigate])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined}>
      <Button
        buttonText="ログイン"
        buttonType="primary"
        onClick={() => {
          loginWithRedirect()
        }}
      />
      <Button
        buttonText="新規登録"
        buttonType="white"
        onClick={() => {
          loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
        }}
      />
      {isAuthenticated && (
        <button
          onClick={() => {
            logout({ logoutParams: { returnTo: window.location.origin } })
          }}
        >
          ログアウト
        </button>
      )}
    </Layout>
  )
}
