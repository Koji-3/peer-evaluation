import styled from 'styled-components'

/* components */
import { Scale } from 'components/molecules'

/* lib, types */
import { type EvaluationLabels } from 'types/types'
import { parseNumberToOneDecimalText } from 'lib/function'

type Props = {
  className?: string
  label: EvaluationLabels
  point: number
  reason: string | null
}

const StyledWrapper = styled.div`
  width: 33rem;
  margin: 0 auto;

  .flex-wrapper {
    margin: 0 0 1.4rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .label {
      color: ${(props): string => props.theme.darkGreen};
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .point {
      color: ${(props): string => props.theme.primary};
      font-size: 3.2rem;
      font-weight: 700;
    }
  }

  .reason {
    margin: 1.4rem 0 0;
    font-size: 1.4rem;
    line-height: 1.5;
    letter-spacing: 0.1em;
  }
`

export const EvaluationDetailItem: React.FC<Props> = ({ className = '', label, point, reason }) => {
  return (
    <StyledWrapper className={className}>
      <div className="flex-wrapper">
        <p className="label">{label}</p>
        <p className="point">{parseNumberToOneDecimalText(point)}</p>
      </div>
      <Scale point={point} />
      {!!reason && <p className="reason">{reason}</p>}
    </StyledWrapper>
  )
}
