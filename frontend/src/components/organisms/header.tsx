import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

/* components */
import { HeaderButton } from 'components/molecules'

/* images */
import logo from 'assets/images/logo.svg'
import loginIcon from 'assets/images/icon/login.svg'
import logoutIcon from 'assets/images/icon/logout.svg'
import profileIcon from 'assets/images/icon/profile.svg'

type Props = {
  className?: string
  isLoggedIn: boolean
  loginUserId?: string
  onClickLogin: () => void
  onClickLogout: () => void
}

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  height: 6.5rem;
  padding: 0 1rem;
  background: ${(props): string => props.theme.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 100;

  .header-button-wrapper {
    display: flex;
    gap: 0.3rem;

    .profile-button {
      padding: 1.2rem 0 0;
    }
  }
`

export const Header: React.FC<Props> = ({ className, isLoggedIn, loginUserId, onClickLogin, onClickLogout }) => {
  const navigate = useNavigate()

  const onClickProfile = (): void => {
    navigate(`/user/${loginUserId}`)
  }

  const Button = (): React.ReactNode => {
    return isLoggedIn ? (
      <div className="header-button-wrapper">
        <HeaderButton icon={logoutIcon} text="ログアウト" onClick={onClickLogout} />
        <HeaderButton icon={profileIcon} text="マイページ" onClick={onClickProfile} className="profile-button" />
      </div>
    ) : (
      <div className="header-button-wrapper">
        <HeaderButton icon={loginIcon} text="ログイン" onClick={onClickLogin} />
      </div>
    )
  }

  return (
    <StyledWrapper className={className}>
      <a href="/">
        <img src={logo} alt="コミュニクル" />
      </a>
      {Button()}
    </StyledWrapper>
  )
}
