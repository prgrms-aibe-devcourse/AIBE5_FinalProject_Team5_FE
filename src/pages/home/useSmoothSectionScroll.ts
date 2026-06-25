import { useEffect } from 'react'

const HEADER_OFFSET_DESKTOP = 80
const HEADER_OFFSET_MOBILE = 64

function getHeaderOffset() {
  return window.matchMedia('(min-width: 768px)').matches ? HEADER_OFFSET_DESKTOP : HEADER_OFFSET_MOBILE
}
const DURATION = 700 // 섹션 간 이동 애니메이션 길이(ms)
const COOLDOWN = 160 // 애니메이션 직후 트랙패드 관성으로 인한 연속 점프 방지(ms)

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * 홈페이지에서 휠 스크롤을 가로채 인접 섹션으로 부드럽게(easing) 이동시킨다.
 * CSS scroll-snap의 기본 스냅 애니메이션은 속도·이징을 제어할 수 없어
 * 직접 requestAnimationFrame으로 애니메이션한다. 터치/키보드는 네이티브 스크롤에 맡긴다.
 */
export function useSmoothSectionScroll() {
  useEffect(() => {
    // 모션 최소화를 선호하면 가로채지 않고 네이티브 스크롤 사용
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    let sections = Array.from(document.querySelectorAll<HTMLElement>('[data-home-section]'))
    const refresh = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>('[data-home-section]'))
    }

    let animating = false
    let unlockAt = 0

    // 헤더 아래에 섹션 상단이 오도록 하는 목표 스크롤 위치
    const targetY = (el: HTMLElement) =>
      Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - getHeaderOffset()))

    // 현재 뷰포트에 가장 가까운 섹션 인덱스
    const currentIndex = () => {
      const y = window.scrollY
      let best = 0
      let bestDist = Infinity
      sections.forEach((el, i) => {
        const dist = Math.abs(targetY(el) - y)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      return best
    }

    const animateTo = (destY: number) => {
      animating = true
      const startY = window.scrollY
      const delta = destY - startY
      const prevSnap = root.style.scrollSnapType
      const prevBehavior = root.style.scrollBehavior
      // 커스텀 애니메이션과 충돌하지 않도록 스냅·네이티브 부드러운 스크롤을 잠시 해제
      root.style.scrollSnapType = 'none'
      root.style.scrollBehavior = 'auto'

      let start: number | null = null
      const step = (now: number) => {
        if (start === null) start = now
        const t = Math.min(1, (now - start) / DURATION)
        window.scrollTo(0, startY + delta * easeInOutCubic(t))
        if (t < 1) {
          requestAnimationFrame(step)
        } else {
          root.style.scrollSnapType = prevSnap
          root.style.scrollBehavior = prevBehavior
          animating = false
          unlockAt = now + COOLDOWN
        }
      }
      requestAnimationFrame(step)
    }

    const onWheel = (event: WheelEvent) => {
      // 가로 위주 스크롤(카드 스크롤러 등)은 그대로 둔다
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

      const dir = event.deltaY > 0 ? 1 : -1
      const index = currentIndex()
      const next = index + dir

      // 첫/마지막 섹션 경계를 넘는 방향이면 네이티브 스크롤 허용(상단 여백·하단 푸터 접근)
      if (next < 0 || next >= sections.length) return

      // 현재 섹션이 뷰포트보다 길면, 안쪽 끝까지는 네이티브로 스크롤하게 둔다
      const current = sections[index]
      const rect = current.getBoundingClientRect()
      const viewport = window.innerHeight - getHeaderOffset()
      if (rect.height > viewport + 4) {
        const top = targetY(current)
        const innerBottom = top + (rect.height - viewport)
        if (dir > 0 && window.scrollY < innerBottom - 2) return
        if (dir < 0 && window.scrollY > top + 2) return
      }

      event.preventDefault()
      if (animating || performance.now() < unlockAt) return
      animateTo(targetY(sections[next]))
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', refresh)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', refresh)
    }
  }, [])
}
