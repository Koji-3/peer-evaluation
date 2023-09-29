import styled from 'styled-components'

/* components */
import { ButtonWithIconLarge } from 'components/molecules'

/* images */
import pageIcon from 'assets/images/icon/page-large.svg'

type Props = {
  className?: string
  isSelfMypage: boolean
  userName: string
  onClickSharePage: () => void
}

const StyledWrapper = styled.div`
  width: 37rem;
  padding: 2rem 0;
  background: ${(props): string => props.theme.white};
  border: 1px solid ${(props): string => props.theme.borderGray};
  border-radius: 1rem;

  > div {
    > p {
      font-size: 1.4rem;
      line-height: 1.78;
      text-align: center;
    }

    .share {
      width: 29rem;
      margin: 1.5rem auto 0;
    }
  }
`

export const NoEvaluation: React.FC<Props> = ({ className = '', isSelfMypage, userName, onClickSharePage }) => {
  return (
    <StyledWrapper className={className}>
      {isSelfMypage ? (
        <div>
          <p>
            まだ紹介者がいません。
            <br />
            マイページを共有して紹介してもらおう！
          </p>
          <ButtonWithIconLarge
            buttonText="このページを共有"
            icon={pageIcon}
            buttonType="primary"
            onClick={onClickSharePage}
            className="share"
          />
        </div>
      ) : (
        <div>
          <p>
            まだ紹介者がいません。
            <br />
            {userName}さんを紹介しよう！
          </p>
        </div>
      )}
    </StyledWrapper>
  )
}
