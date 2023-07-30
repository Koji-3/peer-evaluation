import { useRef, useEffect } from 'react'
import styled, { ThemedStyledProps, DefaultTheme } from 'styled-components'

/* lib, types*/
import { FlashMessage as FlashMessageType } from 'types/types'

/* images */
import closeIcon from 'assets/images/icon/close.svg'

type Props = {
  className?: string
  flashMessage: FlashMessageType
}

type StyleProps = {
  type: 'success' | 'error'
}

const getBackgroundColor = (props: ThemedStyledProps<StyleProps, DefaultTheme>): string => {
  switch (props.type) {
    case 'success':
      return `
        background: ${props.theme.primary};
      `
    case 'error':
      return `
        background: ${props.theme.errorBg};
      `
    default:
      return ''
  }
}

const StyledFlashMessage = styled.div<StyleProps>`
  width: 35.4rem;
  height: 6rem;
  top: 8rem;
  right: -35.4rem;
  z-index: 100;
  animation: slideToLeft 6s forwards;
  position: absolute;
  background: ${(props): string => props.theme.white};
  box-shadow: 0.2rem 0.2rem 1rem 0px rgba(0, 0, 0, 0.05);

  &.close {
    display: none;
    animation: none;
  }

  .message {
    height: 100%;
    padding: 1rem 3.9rem 1rem 2rem;
    font-size: 1.2rem;
    line-height: 1.67;
    display: grid;
    place-items: center start;

    &::before {
      width: 0.5rem;
      height: 100%;
      content: '';
      position: absolute;
      top: 0;
      left: 0;

      ${(props) => getBackgroundColor(props)}
    }
  }

  .close-btn {
    position: absolute;
    top: calc(50% - 0.44rem);
    right: 1.5rem;
  }

  @keyframes slideToLeft {
    0% {
      right: -35.4rem;
    }
    10% {
      right: 0;
    }
    90% {
      right: 0;
    }
    100% {
      right: -35.4rem;
    }
  }
`

export const FlashMessage: React.FC<Props> = ({ className = '', flashMessage }) => {
  const flashMessageRef = useRef<HTMLDivElement>(null)

  const close = (): void => {
    flashMessageRef.current?.classList.add('close')
  }

  useEffect(() => {
    if (flashMessage && flashMessageRef.current?.classList.contains('close')) {
      flashMessageRef.current.classList.remove('close')
    }
  }, [flashMessage])

  return (
    <StyledFlashMessage className={className} type={flashMessage.type} ref={flashMessageRef}>
      <p className="message">{flashMessage.message}</p>
      <button type="button" className="close-btn" onClick={close}>
        <img src={closeIcon} alt="close" />
      </button>
    </StyledFlashMessage>
  )
}
