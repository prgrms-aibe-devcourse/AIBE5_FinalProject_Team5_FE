import { useEffect, useState } from 'react'

export const HOME_CAROUSEL_GAP = 28
export const HOME_CAROUSEL_VIEWPORT_PAD = 48
export const HOME_REVIEW_CARD_WIDTH = 220

export const HOME_REVIEW_VISIBLE = { lg: 5, md: 3, sm: 1 } as const
export const HOME_COURSE_VISIBLE = { lg: 4, md: 3, sm: 1 } as const

export function getReviewViewportWidth(visibleCount: number) {
  return visibleCount * (HOME_REVIEW_CARD_WIDTH + HOME_CAROUSEL_GAP) - HOME_CAROUSEL_GAP + HOME_CAROUSEL_VIEWPORT_PAD
}

export function getCourseCarouselMetrics(visibleCount: number, reviewVisibleCount: number) {
  const viewportWidth = getReviewViewportWidth(reviewVisibleCount)
  const cardStep = (viewportWidth - HOME_CAROUSEL_VIEWPORT_PAD + HOME_CAROUSEL_GAP) / visibleCount
  const cardWidth = cardStep - HOME_CAROUSEL_GAP

  return { viewportWidth, cardWidth, cardStep }
}

export function getWindowItems<T>(items: T[], activeIndex: number, visibleCount: number) {
  const total = items.length

  return Array.from({ length: visibleCount }, (_, slot) => {
    const itemIndex = (activeIndex + slot) % total
    return { slot, item: items[itemIndex], itemIndex }
  })
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

export const HOME_CAROUSEL_SLIDE_MS = 700

function useBreakpointVisibleCounts() {
  const [counts, setCounts] = useState<{ review: number; course: number }>({
    review: HOME_REVIEW_VISIBLE.sm,
    course: HOME_COURSE_VISIBLE.sm,
  })

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)')
    const mqMd = window.matchMedia('(min-width: 768px)')

    const update = () => {
      if (mqLg.matches) {
        setCounts({ review: HOME_REVIEW_VISIBLE.lg, course: HOME_COURSE_VISIBLE.lg })
      } else if (mqMd.matches) {
        setCounts({ review: HOME_REVIEW_VISIBLE.md, course: HOME_COURSE_VISIBLE.md })
      } else {
        setCounts({ review: HOME_REVIEW_VISIBLE.sm, course: HOME_COURSE_VISIBLE.sm })
      }
    }

    update()
    mqLg.addEventListener('change', update)
    mqMd.addEventListener('change', update)
    return () => {
      mqLg.removeEventListener('change', update)
      mqMd.removeEventListener('change', update)
    }
  }, [])

  return counts
}

export function useHomeCarouselBreakpointCounts() {
  return useBreakpointVisibleCounts()
}

export function useHomeReviewVisibleCount() {
  return useBreakpointVisibleCounts().review
}

export function useHomeCourseVisibleCount() {
  return useBreakpointVisibleCounts().course
}

export function useHomeCarouselReviewVisibleCount() {
  return useHomeReviewVisibleCount()
}
