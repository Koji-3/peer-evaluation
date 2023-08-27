import styled from 'styled-components'

/* images */
import arrowLeftIcon from 'assets/images/icon/arrow-left.svg'
import arrowRightIcon from 'assets/images/icon/arrow-right.svg'

type Props = {
  className?: string
  linkText: string
  href: string
  direction: 'left' | 'right'
}

const StyledLink = styled.a`
  color: ${(props): string => props.theme.primary};
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);

  &:hover {
    opacity: 0.7;
  }
`

export const LinkWithIcon: React.FC<Props> = ({ className = '', linkText, href, direction }) => {
  return (
    <StyledLink href={href} className={className}>
      {direction === 'left' && <img src={arrowLeftIcon} alt={linkText} />}
      {linkText}
      {direction === 'right' && <img src={arrowRightIcon} alt={linkText} />}
    </StyledLink>
  )
}
