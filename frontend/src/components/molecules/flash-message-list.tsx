import { useEffect, useRef } from 'react'
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
  top: 1.5rem;
  left: auto;
  z-index: 99;
  position: fixed;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const FlashMessageList: React.FC<Props> = ({ className = '', flashMessageList }) => {
  const flashMessageListRef = useRef<HTMLDivElement>(null)
  const screenY = window.scrollY

  useEffect(() => {
    if (!flashMessageListRef.current) return
    flashMessageListRef.current.style.top = `${screenY +15}px`
  }, [flashMessageList, screenY])

  return (
    <StyledFlashMessageList className={className} ref={flashMessageListRef}>
      {flashMessageList.map(
        (flashMessage, index) => flashMessage && <FlashMessage flashMessage={flashMessage} key={index} className="message" />,
      )}
    </StyledFlashMessageList>
  )
}
