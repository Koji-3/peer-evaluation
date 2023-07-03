import styled from 'styled-components'

/* components */
import { Label, TextInput } from 'components/atoms'

type LabelProps = {
  labelText: string
  //FIXME: 不要なら消す
  isRequired?: boolean
}

type TextInputProps = {
  type?: string
  name?: string
  value: string
  placeholder?: string
  isError?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
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

export const TextInputWithLabel: React.FC<Props> = ({
  className = '',
  labelText,
  isRequired,
  type,
  name,
  value,
  placeholder,
  isError,
  onChange,
}) => {
  return (
    <StyledWrapper className={className}>
      <Label text={labelText} isRequired={isRequired} className="label" />
      <TextInput type={type} name={name} placeholder={placeholder} value={value} isError={isError} onChange={onChange} />
    </StyledWrapper>
  )
}
