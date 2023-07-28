import styled from 'styled-components'

type Props = {
  className?: string
  icon: string
  text: string
  onClick: () => void
}

const StyledWrapper = styled.div`
  width: 6rem;
  height: 6.5rem;
  padding: 1.1rem 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);

  &:hover {
    opacity: 0.7;
  }

  > p {
    color: ${(props): string => props.theme.white};
    font-size: 1rem;
  }
`

export const HeaderButton: React.FC<Props> = ({ className = '', icon, text, onClick }) => {
  return (
    <StyledWrapper onClick={onClick} className={className}>
      <img src={icon} alt={text} />
      <p>{text}</p>
    </StyledWrapper>
  )
}
