import { useCallback, useEffect, useRef, useState } from 'react'
import { getLatestReviews, type CourseReview } from '../../../services/review.ts'
import { toAbsoluteUrl } from '../../../utils/toAbsoluteUrl.ts'
import { reviews } from '../homeData'
import { HomeCarouselNavShell } from './HomeCarouselNav.tsx'
import {
  HOME_CAROUSEL_SLIDE_MS,
  easeOutCubic,
  getWindowItems,
  useHomeCarouselLayout,
} from './homeCarouselLayout.ts'

const REVIEW_FETCH_LIMIT = 10
const ROTATE_INTERVAL_MS = 4000
const MANUAL_ROTATE_PAUSE_MS = 6000
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

function resolveProfileImageUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null

  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  if (trimmed.startsWith('/')) return `${API_BASE}${trimmed}`

  return toAbsoluteUrl(trimmed)
}
function mapMockReviews(): CourseReview[] {
  const base = reviews.map((r) => ({
    reviewId: r.id,
    userNickname: r.nickname,
    userProfileImageUrl: null,
    reviewType: 'GENERAL' as const,
    rating: Number(r.rating) || 5,
    content: r.text,
    createdAt: '',
    verifiedDetail: null,
    courseTitle: r.course,
  }))

  while (base.length < REVIEW_FETCH_LIMIT) {
    const source = reviews[base.length % reviews.length]
    base.push({
      reviewId: base.length + 1,
      userNickname: source.nickname,
      userProfileImageUrl: null,
      reviewType: 'GENERAL',
      rating: Number(source.rating) || 5,
      content: source.text,
      createdAt: '',
      verifiedDetail: null,
      courseTitle: source.course,
    })
  }

  return base.slice(0, REVIEW_FETCH_LIMIT)
}

function getFeaturedSlot(visibleCount: number) {
  return Math.floor((visibleCount - 1) / 2)
}

const CARD_HEIGHT = 268
/** 모바일 후기 카드 — 인기 과정 카드 대비 높이 대폭 축소 */
const REVIEW_MOBILE_HEIGHT_TRIM = 150
const REVIEW_MOBILE_MIN_HEIGHT = 228

function getMobileReviewCardHeight(mobileCardHeight: number) {
  return Math.max(REVIEW_MOBILE_MIN_HEIGHT, mobileCardHeight - REVIEW_MOBILE_HEIGHT_TRIM)
}

function formatRating(rating: number) {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
}

const REVIEW_PREVIEW_MAX_LENGTH = 50

function formatReviewPreview(content: string) {
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (normalized.length <= REVIEW_PREVIEW_MAX_LENGTH) return normalized
  return `${normalized.slice(0, REVIEW_PREVIEW_MAX_LENGTH)}...`
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  const clamped = Math.max(0, Math.min(max, value))

  return (
    <div
      className="inline-flex items-center gap-px"
      role="img"
      aria-label={`별점 ${formatRating(clamped)}점 / ${max}점`}
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = clamped - index

        if (filled >= 1) {
          return (
            <span key={index} className="text-[10px] leading-none text-[#23a03b]" aria-hidden="true">
              ★
            </span>
          )
        }

        if (filled >= 0.5) {
          return (
            <span key={index} className="relative text-[10px] leading-none" aria-hidden="true">
              <span className="text-[#c5dcc9]">★</span>
              <span className="absolute inset-0 w-1/2 overflow-hidden text-[#23a03b]">★</span>
            </span>
          )
        }

        return (
          <span key={index} className="text-[10px] leading-none text-[#c5dcc9]" aria-hidden="true">
            ★
          </span>
        )
      })}
    </div>
  )
}

function getMaxArcDistance(visibleCount: number, featuredSlot: number) {
  return Math.max(featuredSlot, visibleCount - 1 - featuredSlot)
}

/** 중심으로부터의 거리(원 궤적)에 따라 위치·크기·투명도 계산 */
function getArcTransform(
  distanceFromCenter: number,
  maxDistance: number,
  arcSpacing: number,
  disableScale = false,
) {
  const abs = Math.abs(distanceFromCenter)

  if (abs > maxDistance + 0.55) {
    return {
      opacity: 0,
      transform: 'translate3d(0, 24px, 0) scale(0.78)',
      zIndex: 0,
      pointerEvents: 'none' as const,
    }
  }

  const scale = disableScale ? 1 : Math.max(0.84, 1.05 - abs * 0.075)
  const opacity = Math.max(0.52, 1 - abs * 0.17)
  const translateX = distanceFromCenter * arcSpacing
  const translateY = abs * abs * 3

  return {
    opacity,
    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
    zIndex: Math.round(30 - abs * 8),
    pointerEvents: Math.abs(distanceFromCenter) < 0.4 ? ('auto' as const) : ('none' as const),
  }
}

function isFeaturedDistance(distanceFromCenter: number) {
  return Math.abs(distanceFromCenter) < 0.4
}

function Avatar({
  imageUrl,
  nickname,
}: {
  imageUrl?: string | null
  nickname: string
}) {
  const [hasImageError, setHasImageError] = useState(false)
  const resolvedUrl = resolveProfileImageUrl(imageUrl)
  const showImage = Boolean(resolvedUrl) && !hasImageError
  const initial = nickname.trim().charAt(0).toUpperCase() || '?'

  useEffect(() => {
    setHasImageError(false)
  }, [imageUrl])

  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-mistSkyBlue to-softAquaBlue text-sm font-bold text-white shadow-[0_3px_10px_rgba(52,74,100,0.12)] ring-1 ring-mistSkyBlue/30">
      {showImage ? (
        <img
          src={resolvedUrl!}
          alt={`${nickname} 프로필`}
          className="h-full w-full object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  )
}
function ReviewCard({
  review,
  featured,
  cardWidth,
  cardHeight,
}: {
  review: CourseReview
  featured: boolean
  cardWidth: number
  cardHeight: number
}) {
  const courseTitle = review.courseTitle || '과정'

  return (
    <article
      className={`flex h-full w-full flex-col overflow-visible rounded-2xl border text-center transition-[box-shadow,background-color,border-color] duration-700 ${
        featured
          ? 'border-[#d0e0f0] bg-white px-5 pb-5 pt-5 shadow-[0_10px_28px_rgba(52,74,100,0.12)]'
          : 'border-[#e7edf3] bg-white/92 px-4 pb-4 pt-4 shadow-[0_2px_10px_rgba(52,74,100,0.05)] backdrop-blur-sm'
      }`}
      style={{ width: cardWidth, height: cardHeight }}
    >
      <header className="flex w-full shrink-0 flex-col items-center border-b border-[#e9eff5] pb-2.5">
        <Avatar imageUrl={review.userProfileImageUrl} nickname={review.userNickname} />
        <p className="mt-2 w-full text-xs font-semibold tracking-[-0.01em] text-deepOceanNavy font-pretendard line-clamp-1 sm:text-sm">
          {review.userNickname}
        </p>
      </header>

      <div className="mt-3 flex shrink-0 justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2faf4] px-2.5 py-0.5">
          <StarRating value={review.rating} />
          <span className="text-[10px] font-semibold tabular-nums text-[#1f8a3b]">
            {formatRating(review.rating)}
          </span>
        </span>
      </div>

      <p
        className={`mt-3 shrink-0 text-left leading-[1.65] text-[#4a5565] font-pretendard break-words [overflow-wrap:anywhere] ${
          featured ? 'text-[13px]' : 'text-xs'
        }`}
        title={review.content}
      >
        &ldquo;{formatReviewPreview(review.content)}&rdquo;
      </p>

      <footer className="mt-auto w-full shrink-0 border-t border-[#eef2f6] pt-3">
        <p
          className={`w-full text-center font-medium text-secondary font-pretendard line-clamp-1 ${
            featured ? 'text-xs' : 'text-[11px]'
          }`}
          title={courseTitle}
        >
          {courseTitle}
        </p>
      </footer>
    </article>
  )
}

function ReviewCardSkeleton({
  featured,
  cardWidth,
  cardHeight,
}: {
  featured: boolean
  cardWidth: number
  cardHeight: number
}) {
  return (
    <div
      className={`flex h-full w-full animate-pulse flex-col overflow-visible rounded-2xl border border-[#e7edf3] bg-white/50 ${
        featured ? 'px-5 pb-5 pt-5' : 'px-4 pb-4 pt-4'
      }`}
      style={{ width: cardWidth, height: cardHeight }}
    >
      <div className="flex flex-col items-center border-b border-[#e9eff5] pb-2.5">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="mt-2 h-3.5 w-16 rounded bg-gray-200" />
      </div>
      <div className="mt-3 flex justify-center">
        <div className="inline-flex h-6 w-[5rem] items-center gap-1.5 rounded-full bg-gray-200" />
      </div>
      <div className="mt-3.5 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-[92%] rounded bg-gray-200" />
        <div className="h-3 w-[78%] rounded bg-gray-200" />
      </div>
      <div className="mt-4 border-t border-[#eef2f6] pt-3">
        <div className="mx-auto h-3 w-3/4 rounded bg-gray-200" />
      </div>
    </div>
  )
}

function ReviewsCarousel({ reviewsList }: { reviewsList: CourseReview[] }) {
  const {
    review: visibleCount,
    reviewCardStep,
    reviewCardWidth,
    reviewViewportWidth,
    mobileCardWidth,
    mobileCardHeight,
    mobileViewportWidth,
    isMobile,
  } = useHomeCarouselLayout()
  const cardWidth = isMobile ? mobileCardWidth : reviewCardWidth
  const cardHeight = isMobile ? getMobileReviewCardHeight(mobileCardHeight) : CARD_HEIGHT
  const viewportWidth = isMobile ? mobileViewportWidth : reviewViewportWidth
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animDirection, setAnimDirection] = useState<0 | 1 | -1>(0)
  const pauseUntilRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const total = reviewsList.length
  const featuredSlot = getFeaturedSlot(visibleCount)
  const maxArcDistance = getMaxArcDistance(visibleCount, featuredSlot)
  const windowReviews = getWindowItems(reviewsList, activeIndex, visibleCount)

  const runArcAnimation = useCallback(
    (direction: 1 | -1, onComplete: () => void) => {
      if (isAnimatingRef.current || total <= 1) return

      isAnimatingRef.current = true
      setAnimDirection(direction)
      setProgress(0)

      const start = performance.now()

      const frame = (now: number) => {
        const raw = Math.min(1, (now - start) / HOME_CAROUSEL_SLIDE_MS)
        setProgress(easeOutCubic(raw))

        if (raw < 1) {
          rafRef.current = window.requestAnimationFrame(frame)
          return
        }

        onComplete()
        setProgress(0)
        setAnimDirection(0)
        isAnimatingRef.current = false
        rafRef.current = null
      }

      rafRef.current = window.requestAnimationFrame(frame)
    },
    [total],
  )

  const animateNext = useCallback(() => {
    runArcAnimation(1, () => {
      setActiveIndex((prev) => (prev + 1) % total)
    })
  }, [runArcAnimation, total])

  const animatePrev = useCallback(() => {
    runArcAnimation(-1, () => {
      setActiveIndex((prev) => (prev - 1 + total) % total)
    })
  }, [runArcAnimation, total])

  const animateNextRef = useRef(animateNext)
  animateNextRef.current = animateNext

  useEffect(() => {
    if (total <= 1) return

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current || isAnimatingRef.current) return
      animateNextRef.current()
    }, ROTATE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [total])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const enteringReview = animDirection === 1 ? reviewsList[(activeIndex + visibleCount) % total] : null
  const prependedReview = animDirection === -1 ? reviewsList[(activeIndex - 1 + total) % total] : null

  const renderArcCard = (review: CourseReview, distance: number, key: string) => {
    const arcStyle = getArcTransform(distance, maxArcDistance, reviewCardStep, isMobile)
    const featured = isFeaturedDistance(distance)

    return (
      <li
        key={key}
        className="absolute left-1/2 overflow-visible will-change-transform"
        style={{
          top: '50%',
          width: cardWidth,
          height: cardHeight,
          marginLeft: -cardWidth / 2,
          marginTop: -cardHeight / 2,
          opacity: arcStyle.opacity,
          transform: arcStyle.transform,
          zIndex: arcStyle.zIndex,
          pointerEvents: arcStyle.pointerEvents,
        }}
        aria-hidden={!featured}
      >
        <ReviewCard review={review} featured={featured} cardWidth={cardWidth} cardHeight={cardHeight} />
      </li>
    )
  }

  return (
    <HomeCarouselNavShell
      viewportWidth={viewportWidth}
      showNav={total > 1}
      onPrev={() => {
        pauseUntilRef.current = Date.now() + MANUAL_ROTATE_PAUSE_MS
        animatePrev()
      }}
      onNext={() => {
        pauseUntilRef.current = Date.now() + MANUAL_ROTATE_PAUSE_MS
        animateNext()
      }}
      prevLabel="이전 후기"
      nextLabel="다음 후기"
      contentHeight={cardHeight + (isMobile ? 32 : 48)}
    >
      <ul className="relative h-full w-full" style={{ perspective: '1000px' }}>
        {prependedReview &&
          renderArcCard(
            prependedReview,
            -(featuredSlot + 1) + progress,
            `prepend-${prependedReview.reviewId}`,
          )}

        {windowReviews.map(({ slot, item: review }) => {
          const baseDistance = slot - featuredSlot
          const distance =
            animDirection === 1
              ? baseDistance - progress
              : animDirection === -1
                ? baseDistance + progress
                : baseDistance

          return renderArcCard(review, distance, `slot-${slot}-${review.reviewId}`)
        })}

        {enteringReview &&
          renderArcCard(
            enteringReview,
            maxArcDistance + 1 - progress,
            `enter-${enteringReview.reviewId}`,
          )}
      </ul>
    </HomeCarouselNavShell>
  )
}

function ReviewsCarouselSkeleton() {
  const {
    review: visibleCount,
    reviewCardStep,
    reviewCardWidth,
    reviewViewportWidth,
    mobileCardWidth,
    mobileCardHeight,
    mobileViewportWidth,
    isMobile,
  } = useHomeCarouselLayout()
  const cardWidth = isMobile ? mobileCardWidth : reviewCardWidth
  const cardHeight = isMobile ? getMobileReviewCardHeight(mobileCardHeight) : CARD_HEIGHT
  const viewportWidth = isMobile ? mobileViewportWidth : reviewViewportWidth
  const featuredSlot = getFeaturedSlot(visibleCount)
  const maxArcDistance = getMaxArcDistance(visibleCount, featuredSlot)

  return (
    <HomeCarouselNavShell
      viewportWidth={viewportWidth}
      showNav={false}
      onPrev={() => {}}
      onNext={() => {}}
      prevLabel="이전 후기"
      nextLabel="다음 후기"
      contentHeight={cardHeight + (isMobile ? 32 : 48)}
    >
      <ul className="relative h-full w-full">
        {Array.from({ length: visibleCount }, (_, slot) => {
          const distance = slot - featuredSlot
          const arcStyle = getArcTransform(distance, maxArcDistance, reviewCardStep, isMobile)
          const featured = isFeaturedDistance(distance)

          return (
            <li
              key={slot}
              className="absolute left-1/2 overflow-visible"
              style={{
                top: '46%',
                width: cardWidth,
                height: cardHeight,
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2,
                opacity: arcStyle.opacity,
                transform: arcStyle.transform,
                zIndex: arcStyle.zIndex,
              }}
            >
              <ReviewCardSkeleton featured={featured} cardWidth={cardWidth} cardHeight={cardHeight} />
            </li>
          )
        })}
      </ul>
    </HomeCarouselNavShell>
  )
}

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<CourseReview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getLatestReviews(REVIEW_FETCH_LIMIT)
      .then((data) => {
        if (data && data.length > 0) {
          setReviewsList(data)
        } else {
          setReviewsList(mapMockReviews())
        }
      })
      .catch(() => {
        setReviewsList(mapMockReviews())
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <section id="reviews" className="w-full px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16" aria-label="수강생들의 후기" data-home-section>
        <div className="mx-auto w-full max-w-desktop-content">
          <h2 className="text-center text-xl font-bold text-deepOceanNavy font-pretendard sm:text-2xl md:text-[28px]">수강생들의 후기</h2>
          <p className="mt-2 px-2 text-center text-xs text-[#7b8795] font-pretendard sm:text-sm">
            실제 수강생들이 남긴 솔직한 후기를 확인해보세요
          </p>
          <ReviewsCarouselSkeleton />
        </div>
      </section>
    )
  }

  if (reviewsList.length === 0) {
    return null
  }

  return (
    <section id="reviews" className="w-full px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16" aria-label="수강생들의 후기" data-home-section>
      <div className="mx-auto w-full max-w-desktop-content">
        <h2 className="text-center text-xl font-bold text-deepOceanNavy font-pretendard sm:text-2xl md:text-[28px]">수강생들의 후기</h2>
        <p className="mt-2 px-2 text-center text-xs text-[#7b8795] font-pretendard sm:text-sm">
          부트시그널의 솔직한 후기를 확인해보세요
        </p>

        <ReviewsCarousel reviewsList={reviewsList} />
      </div>
    </section>
  )
}
