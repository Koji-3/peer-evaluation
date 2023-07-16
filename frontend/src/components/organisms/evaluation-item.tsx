import styled from 'styled-components'

/* components */
import { ButtonSmall, Icon } from 'components/atoms'

/* lib, types */
import { Evaluation } from 'types/types'

/* images */
import defaultIcon from 'assets/images/icon/default-icon.svg'

type Props = {
  className?: string
  evaluation: Evaluation
  shouldShowButtons: boolean
  publishEvaluation: (id: string) => void
  unpublishEvaluation: (id: string) => void
  deleteEvaluation: (id: string) => void
}

const StyledWrapper = styled.div<{ shouldShowButtons: boolean }>`
  width: 36rem;
  padding: 1.5rem 1.7rem 1.1rem 1.5rem;
  background: ${(props): string => props.theme.white};
  border: 0.1rem solid ${(props): string => props.theme.dividerGray};
  border-radius: 1.5rem;
  position: relative;

  > a {
    .flex-wrapper {
      padding: 0 0 ${(props): string => (props.shouldShowButtons ? '3.2rem' : '0.6rem')};
      display: flex;
      gap: 1.5rem;

      .right-content {
        width: 25.6rem;
        padding: 0.3rem 0 0;

        .evaluateBy {
          padding: 0 0 0.5rem;
          font-size: 1.2rem;
          border-bottom: 0.1rem solid ${(props): string => props.theme.dividerGray};
        }

        .comment {
          padding: 0.5rem 0 0;
          font-size: 1.2rem;
          line-height: 1.7;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      }
    }
  }

  .buttons {
    display: flex;
    gap: 0.8rem;
    position: absolute;
    bottom: 1.1rem;
    right: 1.7rem;
  }
`

export const EvaluationItem: React.FC<Props> = ({
  className = '',
  evaluation,
  shouldShowButtons,
  publishEvaluation,
  unpublishEvaluation,
  deleteEvaluation,
}) => {
  const { id, evaluatorIconUrl, evaluatorName, relationship, comment, is_published } = evaluation

  return (
    <StyledWrapper shouldShowButtons={shouldShowButtons}>
      <a className={className} href={`/evaluation/${id}`}>
        <div className="flex-wrapper">
          <Icon src={evaluatorIconUrl || defaultIcon} alt={evaluatorName} size={4.5} />

          <div className="right-content">
            <p className="evaluateBy">
              {evaluatorName} / {relationship}
            </p>
            <p className="comment">{comment}</p>
          </div>
        </div>
      </a>
      {shouldShowButtons && (
        <div className="buttons">
          {is_published ? (
            <ButtonSmall buttonText="非公開にする" buttonType="white" onClick={() => unpublishEvaluation(id)} />
          ) : (
            <ButtonSmall buttonText="公開する" buttonType="primary" onClick={() => publishEvaluation(id)} />
          )}
          <ButtonSmall buttonText="削除" buttonType="dark" onClick={() => deleteEvaluation(id)} />
        </div>
      )}
    </StyledWrapper>
  )
}
