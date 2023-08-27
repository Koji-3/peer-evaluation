import styled, { DefaultTheme, ThemedStyledProps } from 'styled-components'

type Props = {
  className?: string
  buttonText: string
  icon: string
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
      line-height: 5rem;
    `
  }
  if (props.buttonType === 'white') {
    return `
      color: ${props.theme.black};
      border: 0.1rem solid ${props.theme.black};
      line-height: 4.8rem;
    `
  }
  return ''
}

const StyledButton = styled.button<StyleProps>`
  width: 100%;
  height: 5rem;
  font-size: 1.6rem;
  border-radius: 2.5rem;
  display: flex;
  gap: 0 1rem;
  justify-content: center;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);

  ${(props) => getButtonStyle(props)}

  &:hover {
    opacity: 0.7;
  }
`

export const ButtonWithIconLarge: React.FC<Props & StyleProps> = ({ className = '', buttonText, icon, buttonType, onClick }) => {
  return (
    <StyledButton buttonType={buttonType} onClick={onClick} className={className}>
      <img src={icon} alt={buttonText} />
      <span>{buttonText}</span>
    </StyledButton>
  )
}
