import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Button } from 'components/atoms'
import { TextInputWithLabel } from 'components/molecules'

export const Top: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [value, setValue] = useState<string>('')

  return (
    <>
      <Button
        onClick={() => {
          loginWithRedirect()
        }}
      >
        Log in
      </Button>
      {isAuthenticated && (
        <button
          onClick={() => {
            logout({ logoutParams: { returnTo: window.location.origin } })
          }}
        >
          ログアウト
        </button>
      )}
      <TextInputWithLabel value={value} onChange={(e) => setValue(e.target.value)} placeholder="placeholder" labelText="ラベル" />
    </>
  )
}
