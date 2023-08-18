import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'

/* components */
import { FlashMessage } from 'components/atoms'

/* lib, types*/
import { FlashMessage as FlashMessageType } from 'types/types'

type Props = {
  className?: string
  flashMessageList: (FlashMessageType | undefined)[]
}

const StyledFlashMessageList = styled.div`
  width: 35.4rem;
  left: auto;
  z-index: 99;
  position: fixed;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const FlashMessageList: React.FC<Props> = ({ className = '', flashMessageList }) => {
  const flashMessageListRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((): void => {
    if (!flashMessageListRef.current) return
    const scrollY = window.scrollY
    flashMessageListRef.current.style.top = scrollY === 0 ? '8rem' : `${scrollY/10 + 1.5}rem`
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <StyledFlashMessageList className={className} ref={flashMessageListRef}>
      {flashMessageList.map(
        (flashMessage, index) => flashMessage && <FlashMessage flashMessage={flashMessage} key={index} className="message" />,
      )}
    </StyledFlashMessageList>
  )
}
