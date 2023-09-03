import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

/* components */
import { Icon, Button, ButtonSmall, TextButton } from 'components/atoms'
import { IconInput, TextInputWithLabel, TextareaWithLabel } from 'components/molecules'

/* lib, types */
import { User } from 'types/types'

type Props = {
  className?: string
  userId?: string
  userInput: User
  email: string
  emailError: string | null
  shouldShowEmailInput: boolean
  iconObjectUrl: string
  iconInputError: string | null
  onChangeUserInput: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
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
      margin: 0 0 4rem;
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

      .profile {
        margin: 3rem 0 0;
      }
    }

    .update {
      margin: 0 auto 2.5rem;
    }

    .to-mypage {
      margin: 0 auto 4rem;
    }

    .change-password {
      width: 100%;
      border-bottom: 0.1rem solid ${(props): string => props.theme.borderGray};

      > p {
        width: 29.8rem;
        margin: 0 auto 2rem;
        font-size: 1.2rem;
        line-height: 2rem;
        letter-spacing: 0.05em;

        > span {
          font-weight: 700;
        }

        .login {
          display: inline;
          padding: 0 0.5rem 0 0;
        }
      }
    }
  }

  .leave {
    padding: 2rem 0 0;

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
`

export const UserEditTpl: React.FC<Props> = ({
  userId,
  userInput,
  email,
  emailError,
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

  const goToMypage = (): void => {
    navigate(`/user/${userId}`)
  }

  const isDisabledUpdate = (): boolean => {
    if (!iconObjectUrl || !userInput.name || (shouldShowEmailInput && !email)) return true
    if (emailError || iconInputError) return true
    return false
  }

  return (
    <StyledWrapper>
      <div className="inner">
        <h1>プロフィールの編集</h1>
        <div className="icon">
          <Icon src={iconObjectUrl} alt={userInput.name} size={14.6} className="icon" />
          <IconInput label="アイコンを編集" onChange={onChangeIconInput} error={iconInputError} className="input" />
        </div>

        <div className="input-wrapper">
          <TextInputWithLabel labelText="表示名" name="name" value={userInput.name} maxLength={7} onChange={onChangeUserInput} />
          {/* googleアカウントでログインしている場合はemail, passwordは変更できない */}
          {shouldShowEmailInput && (
            <TextInputWithLabel
              labelText="メールアドレス"
              name="email"
              value={email}
              error={emailError ?? undefined}
              onChange={onChangeEmail}
              className="email"
            />
          )}
          <TextareaWithLabel
            labelText="ひとことコメント"
            name="profile"
            value={userInput.profile}
            placeholder="よろしくお願いします！"
            maxLength={200}
            onChange={onChangeUserInput}
            className="profile"
          />
        </div>

        <Button buttonText="変更する" buttonType="primary" disabled={isDisabledUpdate()} onClick={updateUser} className="update" />
        <Button buttonText="マイページへ" buttonType="white" onClick={goToMypage} className="to-mypage" />

        <div className="change-password">
          <p>
            <span>※パスワードを変更</span>する方は、
            <br />
            <TextButton buttonText="ログインページ" onClick={login} className="login" />
            の「パスワードをお忘れですか？」よりご変更ください。
          </p>
        </div>
        <div className="leave">
          <p>※退会をご希望の方は、下のボタンよりご退会ください。ご利用ありがとうございました。</p>
          <ButtonSmall buttonText="退会する" buttonType="dark" onClick={deleteUser} className="leave-btn" />
        </div>
      </div>
    </StyledWrapper>
  )
}
