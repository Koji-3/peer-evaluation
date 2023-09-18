import styled from 'styled-components'

/* components */
import { ButtonSmall, Icon } from 'components/atoms'
import { LinkWithIcon, EvaluationStatus } from 'components/molecules'

/* lib, types */
import { Evaluation } from 'types/types'

/* images */
import defaultIcon from 'assets/images/icon/default-icon.svg'

type Props = {
  className?: string
  evaluation: Evaluation
  isSelfEvaluation: boolean
  onClickPublish: (id: string) => void
  onClickUnpublish: (id: string) => void
  onClickDelete: (id: string) => void
}

const StyledWrapper = styled.div`
  width: 37rem;

  > .content {
    padding: 0 1.7rem 1.2rem;
    background: ${(props): string => props.theme.white};
    border: 0.1rem solid ${(props): string => props.theme.dividerGray};
    border-radius: 1.5rem;
    position: relative;

    .flex-wrapper {
      display: flex;
      gap: 1.5rem;

      .icon {
        margin: 1.2rem 0 0;
      }

      .right-content {
        width: 28rem;

        .labels {
          height: 3.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 0.1rem solid ${(props): string => props.theme.dividerGray};

          .evaluateBy {
            font-size: 1.2rem;
          }
        }

        .comment {
          margin: 0 0 0.7rem;
          padding: 0.5rem 0 0;
          font-size: 1.4rem;
          line-height: 1.7;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          white-space: pre-wrap;
        }

        .to-detail {
          width: fit-content;
          margin: 0 0 0 auto;
        }
      }
    }
  }

  .buttons {
    margin: 1rem 0 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
  }
`

export const EvaluationItem: React.FC<Props> = ({
  className = '',
  evaluation,
  isSelfEvaluation,
  onClickPublish,
  onClickUnpublish,
  onClickDelete,
}) => {
  const { id, evaluatorIconUrl, evaluatorName, relationship, comment, is_published, evaluateeId } = evaluation

  return (
    <StyledWrapper className={className}>
      <div className="content">
        <div className="flex-wrapper">
          <Icon src={evaluatorIconUrl || defaultIcon} alt={evaluatorName} size={4.5} className="icon" />

          <div className="right-content">
            <div className="labels">
              <p className="evaluateBy">
                {evaluatorName} / {relationship}
              </p>
              {isSelfEvaluation && <EvaluationStatus isPublished={is_published} />}
            </div>
            <p className="comment">{comment}</p>
            <LinkWithIcon linkText="詳しく見る" href={`/introduction/${evaluateeId}/${id}`} direction="right" className="to-detail" />
          </div>
        </div>
      </div>
      {isSelfEvaluation && (
        <div className="buttons">
          {is_published ? (
            <ButtonSmall buttonText="非公開にする" buttonType="white" onClick={() => onClickUnpublish(id)} />
          ) : (
            <ButtonSmall buttonText="公開する" buttonType="primary" onClick={() => onClickPublish(id)} />
          )}
          <ButtonSmall buttonText="削除" buttonType="dark" onClick={() => onClickDelete(id)} />
        </div>
      )}
    </StyledWrapper>
  )
}
