import styled from 'styled-components'

/* lib, types*/
import { mediaSp } from 'lib/media-query'

type Props = {
  className?: string
  name?: string
  label: string
  error?: string | null
  onChange: (file: File) => void
}

const StyledInputWrapper = styled.div`
  .select-file-button {
    width: 10rem;
    height: 3rem;
    margin: 0 auto;
    font-size: 1rem;
    line-height: 3rem;
    text-align: center;
    border: 0.05rem solid ${(props): string => props.theme.black};
    border-radius: 1.5rem;
    display: block;
    cursor: pointer;
  }

  ${mediaSp`
  `}
`

const StyledInput = styled.input`
  display: none;
`

export const IconInput: React.FC<Props> = ({ className = '', name, label, error, onChange }) => {
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files[0] !== undefined) {
      const file = e.target.files[0]
      onChange(file)
    }
  }

  return (
    <StyledInputWrapper className={className}>
      <StyledInput
        type="file"
        id="icon_input"
        name={name}
        onChange={onChangeInput}
        onClick={(e) => {
          e.currentTarget.value = ''
        }}
        accept="image/png, image/jpeg"
      />
      <label htmlFor="icon_input" className="select-file-button">
        {label}
      </label>
      {/* TODO: スタイル */}
      {!!error && <p className="error">{error}</p>}
    </StyledInputWrapper>
  )
}
