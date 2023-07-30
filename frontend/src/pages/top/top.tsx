import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Button } from 'components/atoms'
import { Layout } from 'components/templates'

export const Top: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  return (
    <Layout flashMessage={{ message: 'テストメッセージテストメッセージテストメッセージテストメッセージ', type: 'error' }}>
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
