import { useEffect, useState } from 'react'

export const HOME_CAROUSEL_GAP = 28
export const HOME_CAROUSEL_VIEWPORT_PAD = 48
export const HOME_REVIEW_CARD_WIDTH = 220

export const HOME_COURSE_CARD_CONTENT_HEIGHT = 204
export const HOME_COURSE_CARD_CONTENT_HEIGHT_MOBILE = 188

/** 모바일 flex 레이아웃 — 섹션·쉘 패딩 + 좌우 네비 버튼(40px) + gap(16px) */
const HOME_MOBILE_HORIZONTAL_RESERVE = 176
const HOME_MOBILE_MIN_CARD_WIDTH = 248
const HOME_MOBILE_MAX_CARD_WIDTH = 360

export function getCourseCardImageHeight(cardWidth: number) {
  return Math.round((cardWidth * 2) / 3)
}

export function getCourseCardHeight(cardWidth: number, isMobile = false) {
  const contentHeight = isMobile ? HOME_COURSE_CARD_CONTENT_HEIGHT_MOBILE : HOME_COURSE_CARD_CONTENT_HEIGHT
  return getCourseCardImageHeight(cardWidth) + contentHeight
}

export const HOME_REVIEW_VISIBLE = { lg: 5, md: 3, sm: 1 } as const
export const HOME_COURSE_VISIBLE = { lg: 4, md: 3, sm: 1 } as const

export function getMobileSingleCardWidth(windowWidth: number) {
  const available = windowWidth - HOME_MOBILE_HORIZONTAL_RESERVE
  return Math.max(HOME_MOBILE_MIN_CARD_WIDTH, Math.min(HOME_MOBILE_MAX_CARD_WIDTH, available))
}

export function getReviewCardWidth(visibleCount: number, windowWidth: number) {
  if (visibleCount === HOME_REVIEW_VISIBLE.sm) {
    return getMobileSingleCardWidth(windowWidth)
  }

  return HOME_REVIEW_CARD_WIDTH
}

export function getReviewViewportWidth(visibleCount: number, windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024) {
  if (visibleCount === HOME_REVIEW_VISIBLE.sm) {
    // 모바일 flex 네비 레이아웃 — 카드 너비만 사용(좌우 VIEWPORT_PAD 제외)
    return getMobileSingleCardWidth(windowWidth)
  }

  return visibleCount * (HOME_REVIEW_CARD_WIDTH + HOME_CAROUSEL_GAP) - HOME_CAROUSEL_GAP + HOME_CAROUSEL_VIEWPORT_PAD
}

export function getCourseCarouselMetrics(
  visibleCount: number,
  reviewVisibleCount: number,
  windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
) {
  const viewportWidth = getReviewViewportWidth(reviewVisibleCount, windowWidth)

  if (visibleCount === HOME_COURSE_VISIBLE.sm && reviewVisibleCount === HOME_REVIEW_VISIBLE.sm) {
    const cardWidth = getMobileSingleCardWidth(windowWidth)
    return { viewportWidth: cardWidth, cardWidth, cardStep: cardWidth + HOME_CAROUSEL_GAP }
  }

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

export function useHomeCarouselWindowWidth() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 375))

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return width
}

export function useHomeCarouselLayout() {
  const counts = useBreakpointVisibleCounts()
  const windowWidth = useHomeCarouselWindowWidth()
  const courseMetrics = getCourseCarouselMetrics(counts.course, counts.review, windowWidth)
  const isMobile = counts.review === HOME_REVIEW_VISIBLE.sm
  const mobileCardWidth = courseMetrics.cardWidth
  const mobileCardHeight = getCourseCardHeight(mobileCardWidth, isMobile)
  const mobileViewportWidth = courseMetrics.viewportWidth

  const reviewCardWidth = isMobile ? mobileCardWidth : getReviewCardWidth(counts.review, windowWidth)
  const reviewViewportWidth = isMobile ? mobileViewportWidth : getReviewViewportWidth(counts.review, windowWidth)

  return {
    ...counts,
    windowWidth,
    reviewCardWidth,
    reviewCardStep: reviewCardWidth + HOME_CAROUSEL_GAP,
    reviewViewportWidth,
    courseMetrics,
    mobileCardWidth,
    mobileCardHeight,
    mobileViewportWidth,
    isMobile,
  }
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
