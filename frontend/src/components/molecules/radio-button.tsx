import React from 'react'
import styled from 'styled-components'

/* lib, types */
import { RadioButton as RadioButtonType } from 'types/types'

type Props = {
  className?: string
  buttons: RadioButtonType[]
  checkedValue: string | number
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StyledRadioButton = styled.input`
  display: none;
`

const StyledRadioLabel = styled.label`
  ${StyledRadioButton}:checked + &::after {
    opacity: 1;
  }

  ${StyledRadioButton} + & {
    padding: 0 0 0 3.1rem;
    font-size: 1.4rem;
    letter-spacing: 0.1em;
    position: relative;
    display: block;
    cursor: pointer;

    &::before {
      width: 2rem;
      height: 2rem;
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      box-sizing: border-box;
      border: 0.1rem solid ${(props): string => props.theme.black};
      border-radius: 50%;
    }
    &::after {
      width: 1rem;
      height: 1rem;
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      content: '';
      background: ${(props): string => props.theme.primary};
      border-radius: 50%;
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);
    }
  }
`

export const RadioButton: React.FC<Props> = ({ className = '', buttons, checkedValue }) => {
  return (
    <Wrapper className={className}>
      {buttons.map((button) => (
        <RadioWrapper key={button.value}>
          <StyledRadioButton
            type="radio"
            checked={checkedValue === button.value}
            onChange={button.onChange}
            id={button.id}
            name={button.name}
            value={button.value}
          />
          <StyledRadioLabel htmlFor={button.id}>{button.label}</StyledRadioLabel>
        </RadioWrapper>
      ))}
    </Wrapper>
  )
}
