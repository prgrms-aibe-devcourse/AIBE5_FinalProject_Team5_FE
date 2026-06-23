import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourses, isCourseStatPlaceholder, type Course } from '../../../services/course.ts'
import CourseThumbnail from '../../course/components/CourseThumbnail.tsx'
import { HomeCarouselNavShell } from './HomeCarouselNav.tsx'
import {
  HOME_CAROUSEL_GAP,
  HOME_CAROUSEL_SLIDE_MS,
  HOME_COURSE_VISIBLE,
  easeOutCubic,
  getCourseCarouselMetrics,
  useHomeCarouselBreakpointCounts,
} from './homeCarouselLayout.ts'

const COURSE_CARD_HEIGHT = 320
const HOME_POPULAR_INITIAL_SIZE = 10
const POPULAR_ROTATE_INTERVAL_MS = 4000
const POPULAR_MANUAL_ROTATE_PAUSE_MS = 6000

/** 메인 인기 과정 — 마지막 페이지가 비면 API 다음 페이지에서 새 과정만 추가 (기존 목록 재사용 없음) */
async function fetchPopularCoursesForHome(): Promise<Course[]> {
  const firstPage = await getCourses({ sort: 'popular', page: 0, size: HOME_POPULAR_INITIAL_SIZE })
  const courses = [...firstPage.content]

  const cardsPerPage = HOME_COURSE_VISIBLE.lg
  const remainder = courses.length % cardsPerPage
  const shortfall = remainder === 0 ? 0 : cardsPerPage - remainder

  if (shortfall === 0 || !firstPage.hasNext) {
    return courses
  }

  const nextPage = await getCourses({
    sort: 'popular',
    page: firstPage.page + 1,
    size: shortfall,
  })

  const existingIds = new Set(courses.map((course) => course.id))
  const extraCourses = nextPage.content.filter((course) => !existingIds.has(course.id)).slice(0, shortfall)

  return [...courses, ...extraCourses]
}

function formatRoundedPercentStat(value: string): string {
  if (isCourseStatPlaceholder(value)) return value

  const trimmed = value.trim()
  if (trimmed === '-' || trimmed === '정보 없음') return value

  const numeric = parseFloat(trimmed.replace(/[^\d.]/g, ''))
  if (Number.isNaN(numeric)) return value

  return `${Math.round(numeric)}%`
}

function CourseStatBadge({
  label,
  value,
  roundPercent = false,
}: {
  label: string
  value: string
  roundPercent?: boolean
}) {
  const unavailable = isCourseStatPlaceholder(value)
  const displayValue = roundPercent ? formatRoundedPercentStat(value) : value

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-[#f2faf4] px-2.5 py-0.5 text-[10px] ${
        unavailable ? 'opacity-60' : ''
      }`}
    >
      <span className="font-medium text-[#23a03b]">{label}</span>
      <span className="font-semibold tabular-nums text-[#1f8a3b]">{displayValue}</span>
    </span>
  )
}

function PopularCourseCard({ course, cardWidth }: { course: Course; cardWidth: number }) {
  const navigate = useNavigate()

  const goToCourse = () => {
    if (course.courseSessionId) {
      navigate(`/courses/${course.courseSessionId}`)
    }
  }

  return (
    <article
      style={{ width: cardWidth, height: COURSE_CARD_HEIGHT }}
      tabIndex={0}
      onClick={goToCourse}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && course.courseSessionId) {
          e.preventDefault()
          goToCourse()
        }
      }}
      className="flex shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#e7edf3] bg-white shadow-[0_2px_10px_rgba(52,74,100,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(52,74,100,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-waterlineBlue"
    >
      <div className="relative h-[7.25rem] shrink-0 overflow-hidden bg-foamWhite">
        <CourseThumbnail imageUrl={course.logoUrl} company={course.company} seed={course.id} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-deepOceanNavy font-pretendard">
          {course.title}
        </h3>
        <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-[#566370] font-pretendard">{course.company}</p>

        <div className="mt-2.5 space-y-1 text-[11px] font-normal text-secondary/90 font-pretendard">
          <p className="line-clamp-1">
            {[course.location, course.price].filter(Boolean).join(' | ')}
          </p>
          <p className="line-clamp-1">{course.dateRange}</p>
        </div>

        <footer className="mt-auto shrink-0 border-t border-[#eef2f6] pt-3">
          <div className="flex flex-wrap gap-1.5">
            <CourseStatBadge label="만족도" value={course.satisfaction} roundPercent />
            <CourseStatBadge label="취업률" value={course.employmentRate} roundPercent />
            <CourseStatBadge label="별점" value={course.rating} />
          </div>
        </footer>
      </div>
    </article>
  )
}

function PopularCourseCardSkeleton({ cardWidth }: { cardWidth: number }) {
  return (
    <div
      style={{ width: cardWidth, height: COURSE_CARD_HEIGHT }}
      className="animate-pulse shrink-0 overflow-hidden rounded-2xl border border-[#e7edf3] bg-white/50"
    >
      <div className="h-[7.25rem] bg-gray-200" />
      <div className="space-y-3 px-4 py-4">
        <div className="h-4 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#eef2f6] pt-3">
          <div className="h-5 w-14 rounded-full bg-gray-200" />
          <div className="h-5 w-14 rounded-full bg-gray-200" />
          <div className="h-5 w-12 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

function getPageCourses(courses: Course[], pageIndex: number, visibleCount: number) {
  const start = pageIndex * visibleCount

  return courses.slice(start, start + visibleCount).map((item, slot) => ({
    slot,
    item,
    itemIndex: start + slot,
  }))
}

function PopularCoursesCarousel({ courses }: { courses: Course[] }) {
  const { review: reviewVisibleCount, course: courseVisibleCount } = useHomeCarouselBreakpointCounts()
  const { viewportWidth, cardWidth, cardStep } = getCourseCarouselMetrics(courseVisibleCount, reviewVisibleCount)

  const [activePageIndex, setActivePageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animDirection, setAnimDirection] = useState<0 | 1 | -1>(0)
  const isAnimatingRef = useRef(false)
  const pauseUntilRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const total = courses.length
  const pageCount = Math.max(1, Math.ceil(total / courseVisibleCount))
  const pageSlideDistance = courseVisibleCount * cardStep
  const windowCourses = getPageCourses(courses, activePageIndex, courseVisibleCount)
  const trackWidth = courseVisibleCount * cardStep - HOME_CAROUSEL_GAP
  const trackOffset = (viewportWidth - trackWidth) / 2

  const runSlideAnimation = useCallback(
    (direction: 1 | -1, onComplete: () => void) => {
      if (isAnimatingRef.current || pageCount <= 1) return

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
    [pageCount],
  )

  const animateNext = useCallback(() => {
    runSlideAnimation(1, () => {
      setActivePageIndex((prev) => (prev + 1) % pageCount)
    })
  }, [pageCount, runSlideAnimation])

  const animatePrev = useCallback(() => {
    runSlideAnimation(-1, () => {
      setActivePageIndex((prev) => (prev - 1 + pageCount) % pageCount)
    })
  }, [pageCount, runSlideAnimation])

  const animateNextRef = useRef(animateNext)
  animateNextRef.current = animateNext

  useEffect(() => {
    if (pageCount <= 1) return

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current || isAnimatingRef.current) return
      animateNextRef.current()
    }, POPULAR_ROTATE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [pageCount])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    setActivePageIndex((prev) => Math.min(prev, pageCount - 1))
  }, [pageCount])

  const pauseAutoRotate = () => {
    pauseUntilRef.current = Date.now() + POPULAR_MANUAL_ROTATE_PAUSE_MS
  }

  const goToPage = (pageIndex: number) => {
    if (isAnimatingRef.current || pageIndex === activePageIndex) return
    pauseAutoRotate()
    setActivePageIndex(pageIndex)
  }

  const prevPageIndex = (activePageIndex - 1 + pageCount) % pageCount
  const nextPageIndex = (activePageIndex + 1) % pageCount
  const enteringCourses = animDirection === 1 ? getPageCourses(courses, nextPageIndex, courseVisibleCount) : []
  const prependedCourses = animDirection === -1 ? getPageCourses(courses, prevPageIndex, courseVisibleCount) : []

  const getSlideX = (slot: number, pageOffsetPages = 0) => {
    const baseX = trackOffset + slot * cardStep + pageOffsetPages * pageSlideDistance

    if (animDirection === 1) return baseX - progress * pageSlideDistance
    if (animDirection === -1) return baseX + progress * pageSlideDistance
    return baseX
  }

  const renderSlideCard = (course: Course, slot: number, pageOffsetPages: number, key: string) => (
    <li
      key={key}
      className="absolute top-0 will-change-transform"
      style={{
        width: cardWidth,
        transform: `translate3d(${getSlideX(slot, pageOffsetPages)}px, 0, 0)`,
      }}
    >
      <PopularCourseCard course={course} cardWidth={cardWidth} />
    </li>
  )

  return (
    <>
      <HomeCarouselNavShell
        viewportWidth={viewportWidth}
        showNav={pageCount > 1}
        onPrev={() => {
          pauseAutoRotate()
          animatePrev()
        }}
        onNext={() => {
          pauseAutoRotate()
          animateNext()
        }}
        prevLabel="이전 과정"
        nextLabel="다음 과정"
        contentHeight={COURSE_CARD_HEIGHT + 32}
      >
        <ul className="relative mx-auto h-full" style={{ width: viewportWidth }}>
          {prependedCourses.map(({ slot, item, itemIndex }) =>
            renderSlideCard(item, slot, -1, `prepend-${itemIndex}-${item.id}`),
          )}

          {windowCourses.map(({ slot, item, itemIndex }) =>
            renderSlideCard(item, slot, 0, `page-${activePageIndex}-slot-${slot}-${itemIndex}-${item.id}`),
          )}

          {enteringCourses.map(({ slot, item, itemIndex }) =>
            renderSlideCard(item, slot, 1, `enter-${itemIndex}-${item.id}`),
          )}
        </ul>
      </HomeCarouselNavShell>

      {pageCount > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToPage(index)}
              aria-label={`${index + 1}페이지로 이동`}
              aria-current={index === activePageIndex ? 'true' : undefined}
              className={`h-2 rounded-full transition-all ${
                index === activePageIndex
                  ? 'w-6 bg-deepOceanNavy'
                  : 'w-2 cursor-pointer bg-[#cdd6e0] hover:bg-[#b0c0d0]'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}

function PopularCoursesCarouselSkeleton() {
  const { review: reviewVisibleCount, course: courseVisibleCount } = useHomeCarouselBreakpointCounts()
  const { viewportWidth, cardWidth, cardStep } = getCourseCarouselMetrics(courseVisibleCount, reviewVisibleCount)
  const trackWidth = courseVisibleCount * cardStep - HOME_CAROUSEL_GAP
  const trackOffset = (viewportWidth - trackWidth) / 2

  return (
    <HomeCarouselNavShell
      viewportWidth={viewportWidth}
      showNav={false}
      onPrev={() => {}}
      onNext={() => {}}
      prevLabel="이전 과정"
      nextLabel="다음 과정"
      contentHeight={COURSE_CARD_HEIGHT + 32}
    >
      <ul className="relative mx-auto h-full" style={{ width: viewportWidth }}>
        {Array.from({ length: courseVisibleCount }, (_, slot) => (
          <li
            key={slot}
            className="absolute top-0"
            style={{ transform: `translate3d(${trackOffset + slot * cardStep}px, 0, 0)` }}
          >
            <PopularCourseCardSkeleton cardWidth={cardWidth} />
          </li>
        ))}
      </ul>
    </HomeCarouselNavShell>
  )
}

function PopularCoursesSectionHeader() {
  return (
    <>
      <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">
        이번 주 인기 과정
      </h2>
      <p className="mt-2 text-center text-sm text-[#7b8795] font-pretendard">
        사용자들이 이번 주 가장 관심있어 한 과정을 확인해보세요
      </p>
    </>
  )
}

export default function PopularCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetchPopularCoursesForHome()
      .then((data) => {
        setCourses(data)
      })
      .catch(() => {
        setError('인기 과정을 불러오는 중 오류가 발생했습니다.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
        <div className="mx-auto w-full max-w-desktop-content">
          <PopularCoursesSectionHeader />
          <PopularCoursesCarouselSkeleton />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
        <div className="mx-auto w-full max-w-desktop-content text-center">
          <PopularCoursesSectionHeader />
          <p className="mt-4 text-sm text-red-500 font-pretendard">{error}</p>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return (
      <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
        <div className="mx-auto w-full max-w-desktop-content text-center">
          <PopularCoursesSectionHeader />
          <p className="mt-4 text-sm text-[#7b8795] font-pretendard">현재 모집 예정인 인기 과정이 없습니다.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
      <div className="mx-auto w-full max-w-desktop-content">
        <PopularCoursesSectionHeader />
        <PopularCoursesCarousel courses={courses} />
      </div>
    </section>
  )
}
