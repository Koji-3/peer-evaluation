import styled, { DefaultTheme, ThemedStyledProps } from 'styled-components'

type Props = {
  className?: string
  buttonText: string
  disabled?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

type StyleProps = {
  buttonType: 'primary' | 'white'
}

const getButtonStyle = (props: ThemedStyledProps<StyleProps, DefaultTheme>): string => {
  if (props.buttonType === 'primary') {
    return `
      color: ${props.theme.white};
      background: ${props.theme.primary};
      font-weight: 700;

      &:hover {
      }
    `
  }
  if (props.buttonType === 'white') {
    return `
      color: ${props.theme.black};
      border: 0.1rem solid ${props.theme.primary};
      line-height: 4.8rem;

      &:hover {
      }
    `
  }
  return ''
}

const StyledButton = styled.button<StyleProps>`
  width: 20rem;
  height: 5rem;
  font-size: 1.8rem;
  border-radius: 2.5rem;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);
  display: block;

  ${(props) => getButtonStyle(props)}

  &:disabled {
    color: ${(props): string => props.theme.white};
    background: ${(props): string => props.theme.disabledGray};
    border: none;
    line-height: 5rem;
  }
`

export const Button: React.FC<Props & StyleProps> = ({ className = '', buttonText, buttonType, disabled, onClick }) => {
  return (
    <StyledButton disabled={disabled} buttonType={buttonType} onClick={onClick} className={className}>
      {buttonText}
    </StyledButton>
  )
}
