import styled from 'styled-components'

type Props = {
  className?: string
  src: string
  alt: string
}

type StyleProps = {
  size: number /* rem */
}

const StyledIcon = styled.div<StyleProps>`
  width: ${(props): string => `${props.size}rem`};
  height: ${(props): string => `${props.size}rem`};
  border-radius: 50%;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const Icon: React.FC<Props & StyleProps> = ({ className = '', src, alt, size }) => {
  return (
    <StyledIcon className={className} size={size}>
      <img src={src} alt={alt} />
    </StyledIcon>
  )
}
