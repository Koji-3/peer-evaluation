import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

/* components */
import { Button, Icon } from 'components/atoms'
import { TextInputWithLabel, TextareaWithLabel, IconInput } from 'components/molecules'

/* lib, types, options */
import { mediaSp } from 'lib/media-query'
import { UserInput } from 'types/types'

/* images */
import defaultIcon from 'assets/images/icon/default-icon.svg'

type Props = {
  className?: string
  userInput: UserInput
  iconObjectUrl: string
  iconInputError: string | null
  onChangeUserInput: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
  onChangeIconInput: (file: File) => void
  register: () => void
}

const StyledWrapper = styled.div`
  padding: 6rem 0 15rem;

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

    > .name {
      margin: 0 0 3rem;
    }

    > .profile {
      margin: 0 0 4.5rem;
    }

    .register {
      margin: 0 auto 2.5rem;
    }

    .cancel {
      margin: 0 auto;
    }
  }

  ${mediaSp`
  `}
`

export const SignupTpl: React.FC<Props> = ({
  className,
  userInput,
  iconObjectUrl,
  iconInputError,
  onChangeUserInput,
  onChangeIconInput,
  register,
}) => {
  const navigate = useNavigate()
  const { name, profile } = userInput
  const isDisableRegister = (): boolean => {
    if (!iconObjectUrl || !name || !profile) return true
    if (iconInputError) return true
    return false
  }

  const goToTop = (): void => {
    navigate('/')
  }

  return (
    <StyledWrapper className={className}>
      <div className="inner">
        <h1>新規会員登録</h1>
        <div className="icon">
          <Icon src={iconObjectUrl || defaultIcon} alt={name} size={14.6} className="icon" />
          <IconInput label="アイコンを登録" onChange={onChangeIconInput} error={iconInputError} className="input" />
        </div>

        <TextInputWithLabel labelText="表示名" name="name" value={name} placeholder="taro" onChange={onChangeUserInput} className="name" />
        <TextareaWithLabel
          labelText="ひとことコメント"
          name="profile"
          value={profile}
          placeholder="よろしくお願いします！"
          maxLength={200}
          onChange={onChangeUserInput}
          className="profile"
        />

        <Button buttonText="新規登録する" buttonType="primary" disabled={isDisableRegister()} onClick={register} className="register" />
        <Button buttonText="キャンセル" buttonType="white" onClick={goToTop} className="cancel" />
      </div>
    </StyledWrapper>
  )
}
