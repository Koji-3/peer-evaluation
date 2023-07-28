import styled from 'styled-components'

type Props = {
  className?: string
  text: string
}

const StyledLabel = styled.label`
  color: ${(props): string => props.theme.black};
  font-size: 1.4rem;
  line-height: 1.5;
`

export const Label: React.FC<Props> = ({ className = '', text }) => {
  return <StyledLabel className={className}>{text}</StyledLabel>
}
