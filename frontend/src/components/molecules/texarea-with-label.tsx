import styled from 'styled-components'

/* components */
import { Label, Textarea } from 'components/atoms'

type LabelProps = {
  labelText: string
}

type TextareaProps = {
  name?: string
  value: string
  placeholder?: string
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
`

export const TextareaWithLabel: React.FC<Props> = ({ className = '', labelText, name, value, placeholder, onChange }) => {
  return (
    <StyledWrapper className={className}>
      <Label text={labelText} className="label" />
      <Textarea name={name} placeholder={placeholder} value={value} onChange={onChange} />
    </StyledWrapper>
  )
}
