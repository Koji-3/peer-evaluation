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
  height: 0;
  left: auto;
  z-index: 99;
  position: sticky;
  top: 8.5rem;

  > .inner {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
`

export const FlashMessageList: React.FC<Props> = ({ className = '', flashMessageList }) => {
  return (
    <StyledFlashMessageList className={className}>
      <div className="inner">
        {flashMessageList.map(
          (flashMessage, index) => flashMessage && <FlashMessage flashMessage={flashMessage} key={index} className="message" />,
        )}
      </div>
    </StyledFlashMessageList>
  )
}
