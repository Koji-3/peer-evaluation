import styled from 'styled-components'

/* lib, types */
import { mediaSp } from 'lib/media-query'

type Props = {
  className?: string
  type?: string
  name?: string
  value: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type StyleProps = {
  isError?: boolean
}

const StyledInput = styled.input<StyleProps>`
  width: 100%;
  height: 42px;
  padding: 0 1.5rem;
  color: ${(props): string => props.theme.black};
  font-size: 14px;
  line-height: 42px;
  letter-spacing: 0.1em;
  border: 0.1rem solid ${(props): string => props.theme.borderGray};
  border-radius: 0.5rem;

  &:focus {
    outline: 0;
    /* FIXME: color */
    border: 0.1rem solid ${(props): string => (props.isError ? 'red' : props.theme.black)};
  }

  &::placeholder {
    color: rgba(${(props): string => props.theme.placeholderRgba});
  }

  ${mediaSp`
  `}
`

export const TextInput: React.FC<Props & StyleProps> = ({
  className = '',
  type = 'text',
  name = '',
  placeholder = '',
  value = '',
  isError = false,
  onChange,
}) => {
  return (
    <StyledInput
      className={className}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value || ''}
      isError={isError}
      onChange={onChange}
    />
  )
}
