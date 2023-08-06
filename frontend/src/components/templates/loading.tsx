import styled from 'styled-components'

/* images */
import loading from 'assets/images/loading.gif'

type Props = {
  className?: string
}

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(${(props): string => props.theme.whiteRgb}, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 200;
`

export const LoadingTpl: React.FC<Props> = ({ className }) => {
  return (
    <StyledWrapper className={className}>
      <img src={loading} alt="loading" />
    </StyledWrapper>
  )
}
