import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

/* components */
import { Button } from 'components/atoms'

type Props = {
  className?: string
}

const StyledWrapper = styled.div`
  padding: 15.3rem 0 0;

  > .inner {
    width: 33rem;
    margin: 0 auto;

    .code {
      margin: 0 0 1rem;
      font-size: 6.4rem;
      text-align: center;
    }

    .description {
      margin: 0 0 16rem;
      font-size: 1.2rem;
      line-height: 1.7;
    }

    .to-top {
      margin: 0 auto 14.6rem;
    }

    .about-404 {
      font-size: 1.2rem;

      .title {
        margin: 0 0 2.5rem;
        font-weight: 700;
        text-align: center;
      }

      .content {
        margin: 0 0 3rem;
        line-height: 2rem;
        letter-spacing: 0.06rem;
      }

      .ref {
        font-size: 1rem;
        line-height: 2rem;
        letter-spacing: 0.05rem;
        opacity: 0.5;

        > a {
          text-decoration: underline;
        }
      }
    }
  }
`

export const Page404Tpl: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate()
  const goToTop = (): void => {
    navigate('/')
  }

  return (
    <StyledWrapper className={className}>
      <div className="inner">
        <p className="code">404</p>
        <p className="description">アクセスしたページは削除されたか、URLが変更されているため表示することができません。</p>
        <Button buttonText="ホームへ" buttonType="primary" onClick={goToTop} className="to-top" />

        <div className="about-404">
          <p className="title">▼404とは</p>
          <p className="content">
            404とは、インターネット上からページが削除されるなどして表示できないことを示す。
            <br />
            <br />
            WWW（world wide
            web）を開発したひとり、ロバート・カイリューいわく、「具体的な数字はプログラマーの気分で決められていった。」とのこと。
            <br />
            クライアントエラーを示すステータスコードが400番台に決まり、これといった理由はなく404が「Not Found」に指定された。
            <br />
            <br />
            404の数字の意味には「実は404号室に由来している」「その部屋は世界初のウェブサーヴァーが置かれたところで、スイスの欧州原子核研究機構（CERN）内にある」などの様々な逸話がある。
            <br />
            そのようなエピソードに対して、
            <br />
            「そんなものは完全なる“神話”なのさ。新システム用のコーディングをしているとき、（ページが削除されたといったような）エラー検出に備えたメッセージを長々と書いている余裕なんてないんだ。64キロバイトのメモリーでプログラミングするのがどういうことか、いまのギークたちにはわからないだろうね」とカイリューははねつけた。
          </p>
          <p className="ref">
            引用元：
            <a href="https://wired.jp/2018/01/25/history-of-the-404-error/" target="_blank" rel="noopener noreferrer">
              「404」は部屋番号だった？ 「Not Found」エラーにまつわる噂の真偽を、「生みの親」に聞いてみた
            </a>
          </p>
        </div>
      </div>
    </StyledWrapper>
  )
}
