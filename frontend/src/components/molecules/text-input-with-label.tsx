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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type Props = {
  className?: string
  error?: string
} & LabelProps &
  TextInputProps

const StyledWrapper = styled.div`
  width: 100%;

  .label {
    margin-bottom: 1rem;
    display: block;
  }

  .error {
    padding: 0.8rem 0 0;
    color: ${(props): string => props.theme.errorText};
    font-size: 1.2rem;
    letter-spacing: 0.1em;
  }
`

export const TextInputWithLabel: React.FC<Props> = ({ className = '', labelText, type, name, value, placeholder, error, onChange }) => {
  return (
    <StyledWrapper className={className}>
      <Label text={labelText} className="label" />
      <TextInput type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} />
      {!!error && <p className="error">{error}</p>}
    </StyledWrapper>
  )
}
