import styled from 'styled-components'

/* components */
import { Label, TextInput } from 'components/atoms'

type LabelProps = {
  labelText: string
}

type TextInputProps = {
  type?: string
  name?: string
  value: string
  placeholder?: string
  isError?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type Props = {
  className?: string
} & LabelProps &
  TextInputProps

const StyledWrapper = styled.div`
  width: 100%;

  .label {
    margin-bottom: 1rem;
    display: block;
  }
`

export const TextInputWithLabel: React.FC<Props> = ({ className = '', labelText, type, name, value, placeholder, isError, onChange }) => {
  return (
    <StyledWrapper className={className}>
      <Label text={labelText} className="label" />
      <TextInput type={type} name={name} placeholder={placeholder} value={value} isError={isError} onChange={onChange} />
    </StyledWrapper>
  )
}
