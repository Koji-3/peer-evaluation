import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

/* components */
import { Icon, Button, ButtonSmall } from 'components/atoms'
import { IconInput, TextInputWithLabel } from 'components/molecules'

/* lib, types */
import { mediaSp } from 'lib/media-query'
import { User } from 'types/types'

type Props = {
  className?: string
  userInput: User
  email: string
  shouldShowEmailInput: boolean
  iconObjectUrl: string
  iconInputError: string | null
  onChangeUserInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeIconInput: (file: File) => void
  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void
  login: () => void
  updateUser: () => Promise<void>
  deleteUser: () => Promise<void>
}

const StyledWrapper = styled.div`
  padding: 6rem 0 0;

  > .inner {
    width: 33rem;
    margin: 0 auto;

    > h1 {
      margin: 0 0 3.7rem;
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
    }

    > .icon {
      margin: 0 0 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.4rem;
    }

    .input-wrapper {
      margin: 0 0 4.5rem;

      > .email {
        margin: 3rem 0 0;
      }
    }

    .update {
      margin: 0 auto 2.5rem;
    }

    .go-back {
      margin: 0 auto 4rem;
    }

    .change-password {
      width: 29.8rem;
      margin: 0 auto 4.5rem;
      font-size: 1.2rem;
      line-height: 2rem;
      letter-spacing: 0.05em;

      > span {
        font-weight: 700;
      }

      > a {
        color: ${(props): string => props.theme.blue};
        text-decoration: underline;
      }
    }
  }

  .leave {
    padding: 2.5rem 0 4.3rem;
    background: ${(props): string => props.theme.white};

    > p {
      width: 29.8rem;
      margin: 0 auto 1rem;
      font-size: 1.2rem;
      line-height: 2;
    }

    .leave-btn {
      margin: 0 auto;
    }
  }

  ${mediaSp`
  `}
`

export const UserEditTpl: React.FC<Props> = ({
  userInput,
  email,
  shouldShowEmailInput,
  iconObjectUrl,
  iconInputError,
  onChangeUserInput,
  onChangeIconInput,
  onChangeEmail,
  login,
  updateUser,
  deleteUser,
}) => {
  const navigate = useNavigate()

  const goBack = (): void => {
    navigate(-1)
  }

  return (
    <StyledWrapper>
      <div className="inner">
        <h1>プロフィールの確認・編集</h1>
        <div className="icon">
          {/* TODO: デフォルト画像 */}
          <Icon src={iconObjectUrl || userInput.icon_url} alt={userInput.name} size={14.6} className="icon" />
          <IconInput label="アイコンを登録" onChange={onChangeIconInput} error={iconInputError} className="input" />
        </div>

        <div className="input-wrapper">
          <TextInputWithLabel labelText="表示名" name="name" value={userInput.name} onChange={onChangeUserInput} />
          {/* googleアカウントでログインしている場合はemail, passwordは変更できない */}
          {shouldShowEmailInput && (
            <TextInputWithLabel labelText="メールアドレス" name="email" value={email} onChange={onChangeEmail} className="email" />
          )}
        </div>

        <Button buttonText="変更する" buttonType="primary" onClick={updateUser} className="update" />
        <Button buttonText="戻る" buttonType="white" onClick={goBack} className="go-back" />

        <p className="change-password">
          <span>※パスワードを変更</span>する方は、
          <br />
          <a onClick={login}>ログインページ</a>の「パスワードをお忘れですか？」よりご変更ください。
        </p>
      </div>
      <div className="leave">
        <p>※退会をご希望の方は、以下の「退会する」よりご退会ください。ご利用ありがとうございました。</p>
        <ButtonSmall buttonText="退会する" buttonType="dark" onClick={deleteUser} className="leave-btn" />
      </div>
    </StyledWrapper>
  )
}
