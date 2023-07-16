import { useState } from 'react'
import styled from 'styled-components'

/* components */
import { RadioButton, TextareaWithLabel } from 'components/molecules'

/* lib, types */
import { type EvaluationLabels, RadioButton as RadioButtonType } from 'types/types'

/* images */
import arrowDownIcon from 'assets/images/icon/arrow-down.svg'
import arrowUpIcon from 'assets/images/icon/arrow-up.svg'

type RadioButtonProps = {
  buttons: RadioButtonType[]
  checkedValue: string | number
}

type Props = RadioButtonProps & {
  className?: string
  label: EvaluationLabels
  reasonInput: string
  index: number
  onChangeReasonInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const EVALUATION_NUM = 6

const StyledWrapper = styled.div`
  .flex-wrapper {
    margin: 0 0 2.6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 1.6rem;
      letter-spacing: 0.1em;
    }
    .index {
      font-size: 1.4rem;
      letter-spacing: 0.1em;
    }
  }

  .radio-button {
    margin: 0 0 2rem;
  }

  .toggle {
    color: ${(props): string => props.theme.borderGray};
    font-size: 1.4rem;
    display: flex;
    align-items: center;
  }

  .reason-input {
    padding: 1rem 0 0;
    min-height: 0;
    height: 0;
    transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);
    overflow: hidden;

    &.open {
      min-height: 18.5rem;
    }
  }
`

export const EvaluationFormItem: React.FC<Props> = ({
  className = '',
  buttons,
  checkedValue,
  label,
  reasonInput,
  index,
  onChangeReasonInput,
}) => {
  const [isOpenReasonInput, setIsOpenReasonInput] = useState<boolean>(false)

  const toggleIsOpenReasonInput = (): void => {
    setIsOpenReasonInput((prevState) => !prevState)
  }

  return (
    <StyledWrapper className={className}>
      <div className="flex-wrapper">
        <p className="label">{label}は？</p>
        <p className="index">
          ({index}/{EVALUATION_NUM})
        </p>
      </div>
      <RadioButton buttons={buttons} checkedValue={checkedValue} className="radio-button" />
      <button onClick={toggleIsOpenReasonInput} className="toggle">
        理由（任意）
        {isOpenReasonInput ? (
          <img src={arrowUpIcon} alt="prev" className="toggle-icon" />
        ) : (
          <img src={arrowDownIcon} alt="prev" className="toggle-icon" />
        )}
      </button>

      <div className={`reason-input${isOpenReasonInput ? ' open' : ''}`}>
        <TextareaWithLabel placeholder="理由記入" name="" value={reasonInput} maxLength={200} onChange={onChangeReasonInput} />
      </div>
    </StyledWrapper>
  )
}
