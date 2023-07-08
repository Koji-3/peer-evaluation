import styled from 'styled-components'

/* lib, types */
import { Evaluation } from 'types/types'

/* components */
import { ButtonSmall } from 'components/atoms'

type Props = {
  className?: string
  evaluation: Evaluation
  publishEvaluation: (id: string) => void
  unpublishEvaluation: (id: string) => void
  deleteEvaluation: (id: string) => void
}

const StyledWrapper = styled.a`
  width: 36rem;
  padding: 1.5rem 1.7rem 1.1rem 1.5rem;
  background: ${(props): string => props.theme.white};
  border: 1px solid ${(props): string => props.theme.dividerGray};
  border-radius: 1.5rem;
  display: block;

  .flex-wrapper {
    margin: 0 0 0.2rem;
    display: flex;
    gap: 1.5rem;

    .icon-wrapper {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      overflow: hidden;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .right-content {
      width: 25.6rem;
      padding: 0.3rem 0 0;

      .evaluateBy {
        padding: 0 0 0.5rem;
        font-size: 1.2rem;
        border-bottom: 1px solid ${(props): string => props.theme.dividerGray};
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

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
  }
`

export const EvaluationItem: React.FC<Props> = ({
  className = '',
  evaluation,
  publishEvaluation,
  unpublishEvaluation,
  deleteEvaluation,
}) => {
  const { id, evaluatorIconUrl, evaluatorName, relationship, comment, isPublished } = evaluation

  return (
    <StyledWrapper className={className} href={`/evaluation/${id}`}>
      <div className="flex-wrapper">
        <div className="icon-wrapper">
          <img src={evaluatorIconUrl} alt={evaluatorName} />
        </div>

        <div className="right-content">
          <p className="evaluateBy">
            {evaluatorName} / {relationship}
          </p>
          <p className="comment">{comment}</p>
        </div>
      </div>
      <div className="buttons">
        {isPublished ? (
          <ButtonSmall buttonText="非公開にする" buttonType="white" onClick={() => unpublishEvaluation(id)} />
        ) : (
          <ButtonSmall buttonText="公開する" buttonType="primary" onClick={() => publishEvaluation(id)} />
        )}
        <ButtonSmall buttonText="削除" buttonType="dark" onClick={() => deleteEvaluation(id)} />
      </div>
    </StyledWrapper>
  )
}
