import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

/* lib, types */
import { mediaSp } from 'lib/media-query'
import { Evaluation, EvaluationLabelKeys, EvaluationLabelValues } from 'types/types'

/* components */
import { ButtonSmall } from 'components/atoms'
import { EvaluationDetailItem } from 'components/organisms'

/* images */
import pagePrevIcon from 'assets/images/icon/page-prev.svg'

type Props = {
  className?: string
  evaluation: Evaluation
  publishEvaluation: () => void
  unpublishEvaluation: () => void
  deleteEvaluation: () => void
}

const StyledWrapper = styled.div`
  .inner {
    width: 36rem;
    margin: 0 auto;
    padding: 1.8rem 0 4.2rem;

    > header {
      margin: 0 0 1.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .to-user-top {
        display: flex;
        align-items: center;
        gap: 1.6rem;

        > .icon {
          width: 0.8rem;
          height: 1.2rem;
        }

        > p {
          font-size: 1.2rem;
        }
      }

      .buttons {
        display: flex;
        gap: 1.5rem;
      }
    }

    .content {
      margin: 0 0 3rem;
      padding: 2.4rem 1.5rem 3.6rem;
      background: ${(props): string => props.theme.white};
      border-radius: 1.5rem;

      .evaluator {
        margin: 0 0 4.5rem;

        .icon-wrapper {
          width: 10rem;
          height: 10rem;
          margin: 0 auto 1.8rem;
          border-radius: 50%;
          overflow: hidden;

          > img {
            width: 100%;
            height: 100%;
          }
        }

        > p {
          font-size: 2rem;
          text-align: center;
        }
      }

      .title {
        margin: 0 0 1.5rem;
        font-size: 1.6rem;
        font-weight: 700;
      }

      .comment {
        margin: 0 0 4.9rem;
        font-size: 1.4rem;
        line-height: 1.5;
      }
    }

    .footer-buttons {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }
  }

  ${mediaSp`
  `}
`

export const EvaluationDetailTpl: React.FC<Props> = ({ evaluation, publishEvaluation, unpublishEvaluation, deleteEvaluation }) => {
  const navigate = useNavigate()
  const { isPublished, evaluatorIconUrl, evaluatorName, relationship, evaluatee, comment } = evaluation

  const goToUserTop = (): void => {
    navigate(`/${evaluation.evaluatee.id}`)
  }

  return (
    <StyledWrapper>
      <div className="inner">
        <header>
          <div className="to-user-top">
            <img src={pagePrevIcon} onClick={goToUserTop} alt="評価一覧ページへ" className="icon" />
            <p>評価一覧ページへ</p>
          </div>

          <div className="buttons">
            {isPublished ? (
              <ButtonSmall buttonText="非公開にする" buttonType="white" onClick={unpublishEvaluation} />
            ) : (
              <ButtonSmall buttonText="公開する" buttonType="primary" onClick={publishEvaluation} />
            )}
            <ButtonSmall buttonText="削除" buttonType="dark" onClick={deleteEvaluation} />
          </div>
        </header>

        <div className="content">
          <div className="evaluator">
            <div className="icon-wrapper">
              {/* TODO: デフォルトアイコン */}
              <img src={evaluatorIconUrl ?? 'https://picsum.photos/200/200'} alt={evaluatorName} />
            </div>
            <p>
              {evaluatorName} / {relationship}
            </p>
          </div>
          <p className="title">{evaluatee.name}について</p>
          <p className="comment">{comment}</p>

          {[...Array(6)].map((_, index) => {
            const evalluation = evaluation[EvaluationLabelKeys[index]]
            return (
              <EvaluationDetailItem
                label={EvaluationLabelValues[index]}
                point={evalluation.point}
                reason={evalluation.reason}
                key={index}
              />
            )
          })}
        </div>

        <div className="footer-buttons">
          {isPublished ? (
            <ButtonSmall buttonText="非公開にする" buttonType="white" onClick={unpublishEvaluation} />
          ) : (
            <ButtonSmall buttonText="公開する" buttonType="primary" onClick={publishEvaluation} />
          )}
          <ButtonSmall buttonText="削除" buttonType="dark" onClick={deleteEvaluation} />
        </div>
      </div>
    </StyledWrapper>
  )
}
