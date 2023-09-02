import styled from 'styled-components'

type Props = {
  className?: string
  type?: string
  name?: string
  value: string
  placeholder?: string
  maxLength?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const StyledInput = styled.input`
  width: 100%;
  height: 4.2rem;
  padding: 0 1.5rem;
  color: ${(props): string => props.theme.black};
  font-size: 1.4rem;
  line-height: 4.2rem;
  letter-spacing: 0.1em;
  border: 0.1rem solid ${(props): string => props.theme.borderGray};
  border-radius: 0.5rem;

  &:focus {
    outline: 0;
    border: 0.15rem solid ${(props): string => props.theme.primary};
  }

  &::placeholder {
    color: rgba(${(props): string => props.theme.placeholderRgba});
  }
`

export const TextInput: React.FC<Props> = ({
  className = '',
  type = 'text',
  name = '',
  placeholder = '',
  value = '',
  maxLength,
  onChange,
}) => {
  return (
    <StyledInput
      className={className}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value || ''}
      maxLength={maxLength}
      onChange={onChange}
    />
  )
}
