import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'

/* components */
import { FlashMessageList } from 'components/molecules'
import { Header } from 'components/organisms'
import { LoadingTpl } from 'components/templates'

/* lib, types, apis */
import { FlashMessage as FlashMessageType } from 'types/types'
import { fetchUserByAuth0Id } from 'apis/user'
import { errorMessages } from 'const/errorMessages'

/* images */
import background from 'assets/images/background.svg'

type Props = {
  children?: React.ReactNode
  flashMessages?: FlashMessageType[]
  isLoading?: boolean
}

const StyledWrapper = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;

  > .inner {
    width: 100%;
    max-width: 500px;
    padding: 6.5rem 0 0;
    background: ${(props): string => props.theme.background};
    position: relative;
    overflow: hidden;

    .loading {
      margin: -6.5rem 0 0;
    }
  }
`

export const Layout: React.FC<Props> = ({ children, flashMessages, isLoading }) => {
  const { isLoading: isAuth0Loading, isAuthenticated, logout, loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [layoutFlashMessage, setLayoutFlashMessage] = useState<FlashMessageType | undefined>(undefined)

  useEffect(() => {
    if (isAuth0Loading) return
    if (!isAuthenticated) return
    ;(async () => {
      try {
        const token = await getAccessTokenSilently()
        // Auth0のidからuserIdを取得する
        const user = await fetchUserByAuth0Id(token)
        setUserId(user?.key)
      } catch (e) {
        setLayoutFlashMessage({ type: 'error', message: errorMessages.user.get })
      }
    })()
  }, [getAccessTokenSilently, isAuthenticated, isAuth0Loading])

  return (
    <StyledWrapper>
      <div className="inner">
        {isAuth0Loading || (isLoading && <LoadingTpl className="loading" />)}
        <Header isLoggedIn={isAuthenticated} loginUserId={userId} onClickLogin={loginWithRedirect} onClickLogout={logout} />
        <FlashMessageList flashMessageList={flashMessages ? [layoutFlashMessage, ...flashMessages] : [layoutFlashMessage]} />
        {children}
      </div>
    </StyledWrapper>
  )
}
