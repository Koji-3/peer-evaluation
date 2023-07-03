import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Button, ButtonSmall } from 'components/atoms'
import { TextInputWithLabel } from 'components/molecules'

export const Top: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [value, setValue] = useState<string>('')

  return (
    <>
      <Button
        buttonText="ログイン"
        buttonType="primary"
        onClick={() => {
          loginWithRedirect()
        }}
      />
      <Button
        buttonText="ログイン2"
        buttonType="white"
        onClick={() => {
          loginWithRedirect()
        }}
      />
      <ButtonSmall buttonText="primary" buttonType="primary" onClick={() => {}} />
      <ButtonSmall buttonText="white" buttonType="white" onClick={() => {}} />
      <ButtonSmall buttonText="dark" buttonType="dark" onClick={() => {}} />
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
