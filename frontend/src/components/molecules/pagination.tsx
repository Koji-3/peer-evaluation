import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

/* lib, types*/
import { mediaSp } from 'lib/media-query'

/* images */
import pagePrevIcon from 'assets/images/icon/page-prev.svg'
import pageNextIcon from 'assets/images/icon/page-next.svg'
import pagePrevDisabledIcon from 'assets/images/icon/page-prev-disabled.svg'
import pageNextDisabledIcon from 'assets/images/icon/page-next-disabled.svg'

type Props = {
  className?: string
  currentPage: number
  lastPage: number
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4.5rem;

  .pagination-icon {
    width: 0.8rem;
    cursor: pointer;

    &.disabled {
      cursor: initial;
    }
  }

  .page-nums-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
  }

  ${mediaSp`
  `}
`

const StyledPaginationItem = styled.div`
  width: 1.4rem;
  height: 1.7rem;
  color: ${(props): string => props.theme.inactiveGray};
  font-size: 1.4rem;
  text-align: center;
  line-height: 1.7rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.45, 0, 0.55, 1);

  &:hover:not(&.dots),
  &.current {
    color: ${(props): string => props.theme.black};
  }

  &.current {
    cursor: initial;
  }

  &.dots {
    cursor: initial;
  }

  ${mediaSp`
  `}
`

export const Pagination: React.FC<Props> = ({ className = '', currentPage, lastPage }) => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const params = new URLSearchParams(search)
  console.log(currentPage, lastPage)

  const onClickPrev = (): void => {
    params.set('page', `${currentPage - 1}`)
    navigate({
      pathname,
      search: params.toString(),
    })
  }

  const onClickNext = (): void => {
    params.set('page', `${currentPage + 1}`)
    navigate({
      pathname,
      search: params.toString(),
    })
  }

  const onClickPage = (page: number): void => {
    params.set('page', `${page}`)
    navigate({
      pathname,
      search: params.toString(),
    })
  }

  let paginationItemTexts: string[] = []
  if (lastPage <= 5) {
    ;[...Array(lastPage)].map((_, i) => paginationItemTexts.push(`${i + 1}`))
  }
  if (lastPage > 5) {
    if (currentPage <= 2) {
      ;[...Array(3)].map((_, i) => paginationItemTexts.push(`${i + 1}`))
      paginationItemTexts.push('...', `${lastPage}`)
    }
    if (currentPage > 2 && currentPage < lastPage - 2) {
      paginationItemTexts = ['1', '...', `${currentPage}`, '...', `${lastPage}`]
    }
    if (currentPage >= lastPage - 2) {
      paginationItemTexts.push('1', '...')
      for (let i = lastPage - 2; i < lastPage + 1; i++) {
        paginationItemTexts.push(`${i}`)
      }
    }
  }

  // 1ページしかなかったらページネーションごと非表示に
  if (lastPage === 1) return null
  return (
    <Wrapper className={className}>
      {currentPage === 1 ? (
        <img src={pagePrevDisabledIcon} alt="prev" className="pagination-icon disabled" />
      ) : (
        <img src={pagePrevIcon} onClick={onClickPrev} alt="prev" className="pagination-icon" />
      )}

      <div className="page-nums-wrapper">
        {paginationItemTexts.map((text, index) => (
          <StyledPaginationItem
            key={index}
            onClick={() => {
              text === '...' ? undefined : onClickPage(Number(text))
            }}
            className={`${currentPage}` === text ? 'current' : text === '...' ? 'dots' : ''}
          >
            {text}
          </StyledPaginationItem>
        ))}
      </div>
      {currentPage === lastPage ? (
        <img src={pageNextDisabledIcon} alt="next" className="pagination-icon disabled" />
      ) : (
        <img src={pageNextIcon} onClick={onClickNext} alt="next" className="pagination-icon" />
      )}
    </Wrapper>
  )
}
