import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'

/* lib, types */
import { mediaSp } from 'lib/media-query'
import { fetchUserByAuth0Id } from 'apis/user'

type Props = {
  children?: React.ReactNode
}

const StyledWrapper = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background: ${(props): string => props.theme.background};

  ${mediaSp`
  `}
`

export const Layout: React.FC<Props> = ({ children }) => {
  const { isLoading, isAuthenticated, logout, getAccessTokenSilently } = useAuth0()
  const [loginedUserId, setLoginedUserId] = useState<string>('')
  const [loginedUserName, setLoginedUserName] = useState<string>('')

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently()
          const user = await fetchUserByAuth0Id(token)
          setLoginedUserId(user?.key || '')
          setLoginedUserName(user?.props.name || '')
        } catch (e) {
          // TODO: データ取得失敗のアラート出す
          console.log(e)
        }
      }
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated])

  return (
    <StyledWrapper>
      {/* TODO: ヘッダー */}
      {isAuthenticated && (
        <>
          <p>ログイン中ユーザーID: {loginedUserId}</p>
          <p>ログイン中ユーザー名: {loginedUserName}</p>
          <button
            onClick={() => {
              logout({ logoutParams: { returnTo: window.location.origin } })
            }}
          >
            ログアウト
          </button>
        </>
      )}
      {children}
    </StyledWrapper>
  )
}
