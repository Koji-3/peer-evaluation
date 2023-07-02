import styled from 'styled-components'

/* lib, types */
import { mediaSp } from 'lib/media-query'

type Props = {
  className?: string
  text: string
  //FIXME: 不要なら消す
  isRequired?: boolean
}

const StyledLabel = styled.label`
  color: ${(props): string => props.theme.black};
  font-size: 1.4rem;
  line-height: 1.5;
  letter-spacing: 0.1em;

  //FIXME: 不要なら消す
  span {
    margin-left: 7px;
    color: ${(props): string => props.theme.errorText};
    font-size: 16px;
    line-height: 1.9;
    letter-spacing: 0.04em;
    vertical-align: top;
    display: inline-block;
  }

  ${mediaSp`
  `}
`

export const Label: React.FC<Props> = ({ className = '', text, isRequired }) => {
  return (
    <StyledLabel className={className}>
      {text}
      {/* FIXME: 不要なら消す */}
      {isRequired && <span>*</span>}
    </StyledLabel>
  )
}
