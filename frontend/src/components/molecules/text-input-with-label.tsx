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
  maxLength?: number
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

  .max-length {
    padding: 0.5rem 0 0;
    font-size: 1.2rem;
    text-align: right;
  }

  .error {
    padding: 0.8rem 0 0;
    color: ${(props): string => props.theme.errorText};
    font-size: 1.2rem;
    letter-spacing: 0.1em;
  }
`

export const TextInputWithLabel: React.FC<Props> = ({
  className = '',
  labelText,
  type,
  name,
  value,
  placeholder,
  maxLength,
  error,
  onChange,
}) => {
  return (
    <StyledWrapper className={className}>
      <Label text={labelText} className="label" />
      <TextInput type={type} name={name} placeholder={placeholder} value={value} maxLength={maxLength} onChange={onChange} />
      {!!maxLength && <p className="max-length">※{maxLength}文字以内</p>}
      {!!error && <p className="error">{error}</p>}
    </StyledWrapper>
  )
}
