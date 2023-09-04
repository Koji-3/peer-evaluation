export const keepScrollPosition = (): void => {
  const topInner = document.getElementById('top_inner')
  const scrollPosition = topInner?.scrollTop || 0
  if (topInner) {
    topInner.style.position = 'fixed'
    topInner.style.top = `-${scrollPosition}px`
    sessionStorage.setItem('scrollPosition', scrollPosition.toString())
  }
}

export const restoreScrollPosition = (): void => {
  const topInner = document.getElementById('top_inner')
  const scrollPosition = Number(sessionStorage.getItem('scrollPosition'))
  if (topInner) {
    topInner.style.position = 'relative'
    topInner.style.top = '0'
    topInner.scroll(0, scrollPosition)
  }
}
