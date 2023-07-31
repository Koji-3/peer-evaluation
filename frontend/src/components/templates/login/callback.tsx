import styled from 'styled-components'

/* components */
import { Button } from 'components/atoms'

type Props = {
  className?: string
  onClickResend: () => void
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

    .resend {
      margin: 0 auto;
    }
  }
`

export const LoginCallbackTpl: React.FC<Props> = ({ onClickResend }) => {
  return (
    <StyledWrapper>
      <div className="inner">
        <p>
          ご登録のメールアドレスに、認証のメールを送信しました。認証を行うと自動でログインできます。
          <br />
          メッセージが届かない場合は、時間を置くか、以下の「再送する」ボタンをクリックしてください。
        </p>
        <Button buttonText="再送する" buttonType="primary" onClick={onClickResend} className="resend" />
      </div>
    </StyledWrapper>
  )
}
