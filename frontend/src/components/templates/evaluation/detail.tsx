import styled from 'styled-components'

/* components */
import { ButtonSmall, Icon } from 'components/atoms'
import { LinkWithIcon } from 'components/molecules'
import { EvaluationDetailItem } from 'components/organisms'

/* lib, types */
import { User, Evaluation, EvaluationLabelKeys, EvaluationLabelValues } from 'types/types'

/* images */
import defaultIcon from 'assets/images/icon/default-icon.svg'

type Props = {
  className?: string
  evaluation: Evaluation
  evaluatee: User
  isSelfMyPage: boolean
  onClickPublish: () => void
  onClickUnpublish: () => void
  onClickDelete: () => void
}

const StyledWrapper = styled.div`
  > .inner {
    width: 36rem;
    margin: 0 auto;
    padding: 1.8rem 0 0;

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
        white-space: pre-wrap;
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
  evaluatee,
  isSelfMyPage,
  onClickPublish,
  onClickUnpublish,
  onClickDelete,
}) => {
  const { is_published, evaluatorIconUrl, evaluatorName, relationship, evaluateeId, comment } = evaluation

  return (
    <StyledWrapper className={className}>
      <div className="inner">
        <header>
          <LinkWithIcon linkText="紹介一覧ページへ" href={`/user/${evaluateeId}`} direction="left" />

          {isSelfMyPage && (
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
            <Icon src={evaluatorIconUrl || defaultIcon} alt={evaluatorName} size={10} className="icon" />
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
        {isSelfMyPage && (
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
