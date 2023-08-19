import styled from 'styled-components'

/* components */
import { ButtonSmall, Icon } from 'components/atoms'
import { EvaluationDetailItem } from 'components/organisms'

/* lib, types */
import { Evaluation, EvaluationLabelKeys, EvaluationLabelValues } from 'types/types'

/* images */
import pagePrevIcon from 'assets/images/icon/page-prev.svg'
import defaultIcon from 'assets/images/icon/default-icon.svg'

type Props = {
  className?: string
  evaluation: Evaluation
  evaluateeName: string
  onClickPublish: () => void
  onClickUnpublish: () => void
  onClickDelete: () => void
}

const StyledWrapper = styled.div`
  > .inner {
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
        transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);

        > .icon {
          width: 0.8rem;
          height: 1.2rem;
        }

        > span {
          font-size: 1.2rem;
        }

        &:hover {
          opacity: 0.7;
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

        .icon {
          margin: 0 auto 1.8rem;
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
`

export const EvaluationDetailTpl: React.FC<Props> = ({
  className,
  evaluation,
  evaluateeName,
  onClickPublish,
  onClickUnpublish,
  onClickDelete,
}) => {
  const { is_published, evaluatorIconUrl, evaluatorName, relationship, evaluateeId, comment, shouldShowOperateButtons } = evaluation

  return (
    <StyledWrapper className={className}>
      <div className="inner">
        <header>
          <a href={`/user/${evaluateeId}`} className="to-user-top">
            <img src={pagePrevIcon} alt="紹介一覧ページへ" className="icon" />
            <span>紹介一覧ページへ</span>
          </a>

          {shouldShowOperateButtons && (
            <div className="buttons">
              {is_published ? (
                <ButtonSmall buttonText="非公開にする" buttonType="white" onClick={onClickUnpublish} />
              ) : (
                <ButtonSmall buttonText="公開する" buttonType="primary" onClick={onClickPublish} />
              )}
              <ButtonSmall buttonText="削除" buttonType="dark" onClick={onClickDelete} />
            </div>
          )}
        </header>

        <div className="content">
          <div className="evaluator">
            <Icon src={evaluatorIconUrl || defaultIcon} alt={evaluatorName} size={4.5} className="icon" />
            <p>
              {evaluatorName} / {relationship}
            </p>
          </div>
          <p className="title">{evaluateeName}について</p>
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
        {shouldShowOperateButtons && (
          <div className="footer-buttons">
            {is_published ? (
              <ButtonSmall buttonText="非公開にする" buttonType="white" onClick={onClickUnpublish} />
            ) : (
              <ButtonSmall buttonText="公開する" buttonType="primary" onClick={onClickPublish} />
            )}
            <ButtonSmall buttonText="削除" buttonType="dark" onClick={onClickDelete} />
          </div>
        )}
      </div>
    </StyledWrapper>
  )
}
