import { useEffect, useRef } from 'react'

/**
 * 스크롤 기반 모션 훅 (P3R 랜딩 스타일)
 *
 * 반환된 ref를 섹션 컨테이너에 연결하면, 내부의
 *  - `[data-reveal]`   요소는 뷰포트에 들어올 때 `is-revealed` 클래스가 붙어 등장 애니메이션이 재생되고
 *  - `[data-parallax]` 요소는 스크롤에 따라 `--parallax` CSS 변수가 갱신되어 패럴럭스가 동작합니다.
 *
 * `prefers-reduced-motion` 환경에서는 즉시 표시하고 패럴럭스를 끕니다.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const parallaxTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'))

    // 모션 최소화 환경: 애니메이션 없이 즉시 노출
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      revealTargets.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    // 등장 애니메이션 (한 번만 재생)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )
    revealTargets.forEach((el) => observer.observe(el))

    // 패럴럭스: 스크롤마다 요소 중심과 화면 중심의 거리에 비례해 이동
    let frame = 0
    const updateParallax = () => {
      frame = 0
      const viewportCenter = window.innerHeight / 2
      parallaxTargets.forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.15
        const rect = el.getBoundingClientRect()
        const elementCenter = rect.top + rect.height / 2
        const offset = (elementCenter - viewportCenter) * speed
        el.style.setProperty('--parallax', `${offset.toFixed(2)}px`)
      })
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateParallax)
    }

    if (parallaxTargets.length > 0) {
      updateParallax()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return ref
}
