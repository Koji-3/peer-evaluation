import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'

/* lib, types */
import { mediaSp } from 'lib/media-query'

type Props = {
  children?: React.ReactNode
}

const StyledWrapper = styled.div`
  background: ${(props): string => props.theme.background};

  ${mediaSp`
  `}
`

export const Layout: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth0()

  useEffect(() => {
    // TODO: ヘッダーだしわけ
    console.log(isAuthenticated ? 'isAuthenticated' : 'not isAuthenticated')
  }, [isAuthenticated])

  return (
    <StyledWrapper>
      {/* TODO: ヘッダー */}
      {children}
    </StyledWrapper>
  )
}
