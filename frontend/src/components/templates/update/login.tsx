import styled from 'styled-components'

/* components */
import { Button } from 'components/atoms'

type Props = {
  className?: string
  onClickLogin: () => void
}

const StyledWrapper = styled.div`
  padding: 19.3rem 0 20rem;

  > .inner {
    width: 33rem;
    margin: 0 auto;

    > p {
      margin: 0 0 13.6rem;
      font-size: 1.2rem;
      line-height: 1.7;
    }

    .login {
      margin: 0 auto;
    }
  }
`

export const UpdateLoginTpl: React.FC<Props> = ({ onClickLogin }) => {
  return (
    <StyledWrapper>
      <div className="inner">
        <p>
          メールアドレスを変更しました。
          <br />
          以下の「ログイン」ボタンをクリックして新しいメールアドレスでログインし直してください。
        </p>
        <Button buttonText="ログイン" buttonType="primary" onClick={onClickLogin} className="login" />
      </div>
    </StyledWrapper>
  )
}
