import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Button } from 'components/atoms'

export const Top: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  return (
    <Button
      onClick={() => {
        loginWithRedirect()
      }}
    >
      Log in
    </Button>
  )
}
