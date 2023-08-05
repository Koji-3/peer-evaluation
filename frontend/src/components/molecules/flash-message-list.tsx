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
  top: 8rem;
  right: -35.4rem;
  z-index: 100;
  animation: slideToLeft 6s forwards;
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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

export const FlashMessageList: React.FC<Props> = ({ className = '', flashMessageList }) => {
  return (
    <StyledFlashMessageList className={className}>
      {flashMessageList.map(
        (flashMessage, index) => flashMessage && <FlashMessage flashMessage={flashMessage} key={index} className="message" />,
      )}
    </StyledFlashMessageList>
  )
}
