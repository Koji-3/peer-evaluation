import styled from 'styled-components'

type Props = {
  className?: string
  disabled?: boolean
  value?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children?: React.ReactNode
}
const StyledButton = styled.button`
  width: 100%;
  height: auto;
  font-size: 14px;
  color: ${(props): string => props.theme.white};
  text-align: center;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  background: #000;

  &:disabled {
    background: ${(props): string => props.theme.buttonDisabled};
  }

  p {
    margin-right: 1rem;
  }
`

export const Button: React.FC<Props> = ({ className = '', disabled, value, children, onClick }) => {
  return (
    <StyledButton disabled={disabled} value={value} onClick={onClick} className={className}>
      {children}
    </StyledButton>
  )
}
