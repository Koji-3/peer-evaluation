import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Button, ButtonSmall } from 'components/atoms'
import { TextInputWithLabel, RadarChart } from 'components/molecules'

export const Top: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [value, setValue] = useState<string>('')
  const data = {
    labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
    datasets: [
      {
        label: '',
        data: [2, 9, 3, 5, 2, 3],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  }

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
      <RadarChart data={data} />
    </>
  )
}
