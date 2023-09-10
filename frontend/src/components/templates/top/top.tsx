import styled from 'styled-components'

/* components */
import { Button } from 'components/atoms'

/* images */
import evaluationFromOthers from 'assets/images/lp/evaluation-from-others.svg'
import mypageNo1 from 'assets/images/lp/mypage-no1.svg'
import mypageNo2 from 'assets/images/lp/mypage-no2.svg'
import mypageNo3 from 'assets/images/lp/mypage-no3.svg'
import mypage from 'assets/images/lp/mypage.svg'
import share from 'assets/images/lp/share.svg'

type Props = {
  className?: string
  signup: () => void
}

const StyledWrapper = styled.div`
  padding: 4.5rem 0 0;

  > .inner {
    width: 35rem;
    margin: 0 auto;

    .underline {
      color: ${(props): string => props.theme.primary};
      font-size: 2.4rem;
      font-weight: 700;
      text-decoration-line: underline;
      text-decoration-thickness: 0.7rem;
      text-decoration-color: ${(props): string => props.theme.yellow};
      text-underline-offset: -0.5rem;
    }

    .signup {
      margin: 0 auto;
    }

    .fv {
      margin: 0 0 6rem;

      .keyword {
        margin: 0 0 5.4rem;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;

        .underline {
          font-size: 3.2rem;
        }
      }
    }
  }
`

const StyledItem = styled.div`
  border: 3px solid ${(props): string => props.theme.primary};
  border-radius: 1rem;
  background: ${(props): string => props.theme.white};

  & + & {
    margin-top: 3rem;
  }

  &.evaluation-from-others {
    padding: 4rem 0 3rem;

    > .description {
      margin: 0 0 2rem;
      font-size: 1.8rem;
      text-align: center;
    }

    > img {
      margin: 0 auto 2rem;
    }

    .sub-description {
      font-size: 1.4rem;
      font-weight: 700;
      text-align: center;

      > strong {
        font-size: 2rem;
        font-weight: inherit;
      }
    }
  }

  &.mypage {
    padding: 4rem 0 2rem;

    > .description {
      margin: 0 0 2.5rem;
      font-size: 1.6rem;
      font-weight: 700;
      text-align: center;
    }

    .points {
      width: 29rem;
      margin: 0 auto 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem 0;

      > div {
        display: flex;
        justify-content: space-between;

        > p {
          font-size: 1.6rem;
        }
      }
    }

    > img {
      margin: 0 auto;
    }
  }

  &.share {
    padding: 4rem 0 2rem;

    > .description {
      margin: 0 auto 2.5rem;
      font-size: 1.6rem;
      text-align: center;
    }

    > img {
      margin: 0 auto;
    }
  }
`

const StyledItemsWraper = styled.div`
  margin: 0 0 5rem;
`

export const TopTpl: React.FC<Props> = ({ className, signup }) => {
  return (
    <StyledWrapper className={className}>
      <div className="inner">
        <div className="fv">
          <p className="keyword">
            自己紹介ではなく、
            <br />
            <strong className="underline"> 他己紹介 </strong>で繋がろう。
          </p>
          <Button buttonText="新規会員登録" buttonType="primary" onClick={signup} className="signup" />
        </div>

        <StyledItemsWraper>
          <StyledItem className="evaluation-from-others">
            <p className="description">
              <strong className="underline"> 他人から見た自分 </strong>
              <br />
              を知ってもらえる
            </p>
            <img src={evaluationFromOthers} alt="他人から見た自分" />
            <p className="sub-description">
              自分の知らない自分を<strong> 発見 </strong>できるかも！
            </p>
          </StyledItem>

          <StyledItem className="mypage">
            <p className="description">
              友達に評価を書いてもらうと
              <br />
              こんなマイページが作れます
            </p>
            <div className="points">
              <div>
                <img src={mypageNo1} alt="No.1" />
                <p>
                  <strong className="underline">ペンタゴングラフ</strong>
                  <br />
                  でひと目で分かる
                </p>
              </div>
              <div>
                <img src={mypageNo2} alt="No.2" />
                <p>
                  <strong className="underline">紹介コメント</strong>が一覧
                  <br />
                  で見やすい
                </p>
              </div>
              <div>
                <img src={mypageNo3} alt="No.3" />
                <p>
                  <strong className="underline">このページを共有</strong>
                  <br />
                  で簡単に知ってもらえる
                </p>
              </div>
            </div>
            <img src={mypage} alt="マイページ" />
          </StyledItem>

          <StyledItem className="share">
            <p className="description">
              <strong className="underline">マイページをシェア</strong>して
              <br />
              自分を知ってもらおう
            </p>
            <img src={share} alt="マイページをシェア" />
          </StyledItem>
        </StyledItemsWraper>

        <Button buttonText="新規会員登録" buttonType="primary" onClick={signup} className="signup" />
      </div>
    </StyledWrapper>
  )
}
