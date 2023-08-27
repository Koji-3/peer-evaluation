import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

/* components */
import { Button } from 'components/atoms'

type Props = {
  className?: string
}

const StyledWrapper = styled.div`
  padding: 15.3rem 0 20rem;

  > .inner {
    width: 33rem;
    margin: 0 auto;

    .code {
      margin: 0 0 1rem;
      font-size: 6.4rem;
      text-align: center;
    }

    .description {
      margin: 0 0 16rem;
      font-size: 1.2rem;
      line-height: 1.7;
    }

    .to-top {
      margin: 0 auto;
    }
  }
`

export const Page404Tpl: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate()
  const goToTop = (): void => {
    navigate('/')
  }

  return (
    <StyledWrapper className={className}>
      <div className="inner">
        <p className="code">404</p>
        <p className="description">アクセスしたページは削除されたか、URLが変更されているため表示することができません。</p>
        <Button buttonText="トップへ" buttonType="primary" onClick={goToTop} className="to-top" />
      </div>
    </StyledWrapper>
  )
}
