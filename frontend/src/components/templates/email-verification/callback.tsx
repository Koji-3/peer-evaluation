import styled from 'styled-components'

type Props = {
  className?: string
}

const StyledWrapper = styled.div`
  padding: 19.3rem 0 20rem;

  > .inner {
    width: 33rem;
    margin: 0 auto;

    > p {
      font-size: 1.2rem;
      line-height: 1.7;
      text-align: center;
    }
  }
`

export const EmailVerificationCallbackTpl: React.FC<Props> = () => {
  return (
    <StyledWrapper>
      <div className="inner">
        <p>メールアドレスが認証されました。</p>
      </div>
    </StyledWrapper>
  )
}
