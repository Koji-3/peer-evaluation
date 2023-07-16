import { ReactElement } from 'react'
import styled from 'styled-components'

/* lib, types */
import { mediaSp } from 'lib/media-query'

type Props = {
  className?: string
  point: number
}

const StyledWrapper = styled.div`
  position: relative;

  ${mediaSp`
  `}
`

const StyledScaleBackgroundWrapper = styled.div`
  display: flex;
  gap: 0.1rem;

  > div {
    width: 6.5rem;
    height: 1.6rem;
    background: ${(props): string => props.theme.scaleGray};

    &:first-child,
    &:last-child {
      width: 6.6rem;
    }
    &:first-child {
      border-radius: 0.8rem 0 0 0.8rem;
    }
    &:last-child {
      border-radius: 0 0.8rem 0.8rem 0;
    }
  }
`

const StyledScaleWrapper = styled.div<{ decimal: number }>`
  display: flex;
  gap: 0.1rem;
  position: absolute;
  top: 0;
  left: 0;

  > div {
    width: 6.5rem;
    height: 1.6rem;
    background: ${(props): string => props.theme.primary};

    &:first-child {
      border-radius: 0.8rem 0 0 0.8rem;
    }

    &.right-end {
      border-radius: 0 0.8rem 0.8rem 0;
    }

    &.decimal {
      width: ${(props): string => `calc(6.5rem * ${props.decimal})`};

      &.left-end {
        width: ${(props): string => `calc(6.6rem * ${props.decimal})`};
        border-radius: 0.8rem 0 0 0.8rem;
      }
    }
  }
`

export const Scale: React.FC<Props> = ({ className = '', point }) => {
  const renderScaleBackground = (): ReactElement => (
    <StyledScaleBackgroundWrapper>
      <div />
      <div />
      <div />
      <div />
      <div />
    </StyledScaleBackgroundWrapper>
  )

  const renderScale = (): ReactElement => {
    const decimal = point - Math.floor(point)
    if (decimal === 0) {
      return (
        <StyledScaleWrapper decimal={0}>
          {[...Array(Math.floor(point))].map((_, index) => (
            <div key={index} className={index === 4 ? 'right-end' : ''} />
          ))}
        </StyledScaleWrapper>
      )
    }
    if (point < 1) {
      return (
        <StyledScaleWrapper decimal={decimal}>
          <div className="decimal left-end" />
        </StyledScaleWrapper>
      )
    }
    return (
      <StyledScaleWrapper decimal={decimal}>
        {[...Array(Math.floor(point))].map((_, index) => (
          <div key={index} />
        ))}
        <div className="decimal" />
      </StyledScaleWrapper>
    )
  }

  return (
    <StyledWrapper className={className}>
      {renderScaleBackground()}
      {renderScale()}
    </StyledWrapper>
  )
}
