import styled, { DefaultTheme, ThemedStyledProps } from 'styled-components'

type Props = {
  className?: string
  buttonText: string
  disabled?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

type StyleProps = {
  buttonType: 'primary' | 'white' | 'dark'
}

const getButtonStyle = (props: ThemedStyledProps<StyleProps, DefaultTheme>): string => {
  if (props.buttonType === 'primary') {
    return `
      color: ${props.theme.white};
      background: ${props.theme.primary};

      &:hover {
      }
    `
  }
  if (props.buttonType === 'white') {
    return `
      color: ${props.theme.black};
      border: 0.1rem solid ${props.theme.primary};
      line-height: 2.8rem;

      &:hover {
      }
    `
  }
  if (props.buttonType === 'dark') {
    return `
      color: ${props.theme.white};
      background: ${props.theme.darkGreen};

      &:hover {
      }
    `
  }
  return ''
}

const StyledButtonSmall = styled.button<StyleProps>`
  width: auto;
  height: 3rem;
  padding: 0 1.5rem;
  font-size: 1rem;
  border-radius: 1.5rem;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);
  display: block;

  ${(props) => getButtonStyle(props)}/* FIXME */
  /* &:disabled {
  } */
`

export const ButtonSmall: React.FC<Props & StyleProps> = ({ className = '', buttonText, buttonType, disabled, onClick }) => {
  return (
    <StyledButtonSmall disabled={disabled} buttonType={buttonType} onClick={onClick} className={className}>
      {buttonText}
    </StyledButtonSmall>
  )
}
