import styled from 'styled-components'

/* components */
import { Label, Textarea } from 'components/atoms'

type LabelProps = {
  labelText?: string
}

type TextareaProps = {
  name?: string
  value: string
  placeholder?: string
  maxLength?: number
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

type Props = {
  className?: string
} & LabelProps &
  TextareaProps

const StyledWrapper = styled.div`
  width: 100%;

  .label {
    margin-bottom: 1rem;
    display: block;
  }

  .max-length {
    padding: 0.5rem 0 0;
    font-size: 1.2rem;
    text-align: right;
  }
`

export const TextareaWithLabel: React.FC<Props> = ({ className = '', labelText, name, value, placeholder, maxLength, onChange }) => {
  return (
    <StyledWrapper className={className}>
      {!!labelText && <Label text={labelText} className="label" />}
      <Textarea name={name} placeholder={placeholder} value={value} maxLength={maxLength} onChange={onChange} />
      {!!maxLength && <p className="max-length">※{maxLength}文字以内</p>}
    </StyledWrapper>
  )
}
