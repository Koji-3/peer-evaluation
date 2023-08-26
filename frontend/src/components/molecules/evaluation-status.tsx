import styled from 'styled-components'

type Props = {
  className?: string
  isPublished: boolean
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 0.5rem;

  .point {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    box-sizing: border-box;
    &.published {
      background: ${(props): string => props.theme.primary};
    }
    &.not-published {
      background: ${(props): string => props.theme.white};
      border: 0.1rem solid ${(props): string => props.theme.inactiveGray};
    }
  }

  .status {
    font-size: 1rem;
    font-weight: 700;

    &.published {
      color: ${(props): string => props.theme.primary};
    }
    &.not-published {
      color: ${(props): string => props.theme.inactiveGray};
    }
  }
`

export const EvaluationStatus: React.FC<Props> = ({ className = '', isPublished }) => {
  return (
    <StyledWrapper className={className}>
      <span className={`point ${isPublished ? 'published' : 'not-published'}`} />
      <span className={`status ${isPublished ? 'published' : 'not-published'}`}>{isPublished ? '公開中' : '非公開'}</span>
    </StyledWrapper>
  )
}
