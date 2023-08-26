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
  onClickPublish: (id: string) => void
  onClickUnpublish: (id: string) => void
  onClickDelete: (id: string) => void
}

const StyledWrapper = styled.div`
  width: 36rem;

  > .content {
    padding: 1.2rem 1.7rem;
    background: ${(props): string => props.theme.white};
    border: 0.1rem solid ${(props): string => props.theme.dividerGray};
    border-radius: 1.5rem;
    position: relative;

    .flex-wrapper {
      display: flex;
      gap: 1.5rem;

      .right-content {
        width: 28rem;

        .evaluateBy {
          padding: 0 0 1rem;
          font-size: 1.4rem;
          border-bottom: 0.1rem solid ${(props): string => props.theme.dividerGray};
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
        }

        .to-detail {
          width: fit-content;
          margin: 0 0 0 auto;
        }
      }
    }

    .evaluation-status {
      position: absolute;
      top: 1.2rem;
      right: 1.7rem;
    }
  }

  .buttons {
    margin: 1rem 0 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
  }
`

export const EvaluationItem: React.FC<Props> = ({ className = '', evaluation, onClickPublish, onClickUnpublish, onClickDelete }) => {
  const { id, evaluatorIconUrl, evaluatorName, relationship, comment, is_published, evaluateeId, shouldShowOperateButtons } = evaluation

  return (
    <StyledWrapper className={className}>
      <div className="content">
        <div className="flex-wrapper">
          <Icon src={evaluatorIconUrl || defaultIcon} alt={evaluatorName} size={4.5} />

          <div className="right-content">
            <p className="evaluateBy">
              {evaluatorName} / {relationship}
            </p>
            <p className="comment">{comment}</p>
            <LinkWithIcon linkText="詳しく見る" href={`/evaluation/${evaluateeId}/${id}`} direction="right" className="to-detail" />
          </div>
        </div>
        {shouldShowOperateButtons && <EvaluationStatus isPublished={is_published} className="evaluation-status" />}
      </div>
      {shouldShowOperateButtons && (
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
