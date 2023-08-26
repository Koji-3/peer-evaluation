import styled from 'styled-components'

type Props = {
  className?: string
  buttonText: string
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const StyledButton = styled.button`
  color: ${(props): string => props.theme.primary};
  font-size: 1.2rem;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);
  display: block;

  &:hover {
    opacity: 0.7;
  }
`

export const TextButton: React.FC<Props> = ({ className = '', buttonText, onClick }) => {
  return (
    <StyledButton onClick={onClick} className={className}>
      {buttonText}
    </StyledButton>
  )
}
