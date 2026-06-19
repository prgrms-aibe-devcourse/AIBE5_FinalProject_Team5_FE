import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourses, type Course } from '../../../services/course.ts'
import CourseThumbnail from '../../course/components/CourseThumbnail.tsx'

export default function PopularCoursesSection() {
  const navigate = useNavigate()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCardsCount, setVisibleCardsCount] = useState(4)

  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    // popular 정렬로 아직 개설되지 않은 인기과정 최대 10개 조회
    getCourses({ sort: 'popular', page: 0, size: 10 })
      .then((data) => {
        setCourses(data.content)
      })
      .catch(() => {
        setError('인기 과정을 불러오는 중 오류가 발생했습니다.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    const updateVisibleCards = () => {
      const scroller = scrollerRef.current
      if (!scroller) return
      const card = scroller.querySelector<HTMLElement>('[data-course-card]')
      const step = card ? card.offsetWidth + 20 : 280
      const count = Math.max(1, Math.round(scroller.clientWidth / step))
      setVisibleCardsCount(count)
    }

    if (courses.length > 0) {
      // DOM 업데이트 완료 후 계산을 보장하기 위해 짧은 지연 처리
      const timer = setTimeout(updateVisibleCards, 100)
      window.addEventListener('resize', updateVisibleCards)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', updateVisibleCards)
      }
    }
  }, [courses])

  const scrollByPage = (direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector<HTMLElement>('[data-course-card]')
    const step = card ? card.offsetWidth + 20 : 280
    scroller.scrollBy({ left: step * visibleCardsCount * direction, behavior: 'smooth' })
  }

  const scrollToPage = (pageIndex: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector<HTMLElement>('[data-course-card]')
    const step = card ? card.offsetWidth + 20 : 280
    scroller.scrollTo({ left: pageIndex * visibleCardsCount * step, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector<HTMLElement>('[data-course-card]')
    const step = card ? card.offsetWidth + 20 : 280
    const scrollLeft = scroller.scrollLeft
    const cardIndex = Math.round(scrollLeft / step)
    setActiveIndex(Math.min(Math.ceil(cardIndex / visibleCardsCount), Math.ceil(courses.length / visibleCardsCount) - 1))
  }

  if (isLoading) {
    return (
      <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
        <div className="mx-auto w-full max-w-[1100px]">
          <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">이번 주 인기 과정</h2>
          <p className="mt-2 text-center text-sm text-[#7b8795] font-pretendard">
            사용자들이 이번 주 가장 관심있어 한 과정을 확인해보세요
          </p>
          <div className="mt-8 flex justify-center gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[260px] h-[340px] shrink-0 rounded-2xl border border-[#e4e8ee] bg-white/50 p-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)] animate-pulse">
                <div className="h-24 w-full rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                <div className="mt-6 h-3 w-full rounded bg-gray-200" />
                <div className="mt-6 h-3 w-full rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
        <div className="mx-auto w-full max-w-[1100px] text-center">
          <h2 className="text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">이번 주 인기 과정</h2>
          <p className="mt-2 text-sm text-red-500 font-pretendard">{error}</p>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return (
      <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
        <div className="mx-auto w-full max-w-[1100px] text-center">
          <h2 className="text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">이번 주 인기 과정</h2>
          <p className="mt-4 text-sm text-[#7b8795] font-pretendard">현재 모집 예정인 인기 과정이 없습니다.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="popular-courses" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">이번 주 인기 과정</h2>
        <p className="mt-2 text-center text-sm text-[#7b8795] font-pretendard">
          사용자들이 이번 주 가장 관심있어 한 과정을 확인해보세요
        </p>

        <div className="relative mt-8">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="이전 과정"
            className="absolute -left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#e1e5ea] bg-white/85 backdrop-blur-sm text-[#7c8796] shadow-[0_4px_12px_rgba(52,74,100,0.1)] transition-colors hover:border-waterlineBlue hover:text-deepOceanNavy md:-left-5"
          >
            ←
          </button>

          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="w-full flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {courses.map((course) => (
              <article
                key={course.id}
                data-course-card
                tabIndex={0}
                onClick={() => {
                  if (course.courseSessionId) {
                    navigate(`/courses/${course.courseSessionId}`)
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && course.courseSessionId) {
                    e.preventDefault()
                    navigate(`/courses/${course.courseSessionId}`)
                  }
                }}
                className="w-[260px] shrink-0 snap-start rounded-2xl border border-[#e4e8ee] bg-white/85 backdrop-blur-sm p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-md cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-waterlineBlue"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-xl bg-foamWhite">
                  <CourseThumbnail imageUrl={course.logoUrl} />
                </div>

                <h3 className="mt-4 line-clamp-2 min-h-[2.6rem] text-sm font-bold text-[#17202c] font-pretendard">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-[#6f7c8d] font-pretendard line-clamp-1">{course.company}</p>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#6f7c8d] font-pretendard">
                  <span>{course.location}</span>
                  <span className="text-[#d2d9e0]">|</span>
                  <span>{course.price}</span>
                  <span className="ml-auto font-semibold text-[#23a03b]">
                    ★ {course.rating !== '—' ? course.rating : '0.0'}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#eef2f6] pt-3 text-xs text-[#6f7c8d] font-pretendard">
                  <span className="line-clamp-1 mr-2">{course.dateRange}</span>
                  <span className="font-semibold text-deepOceanNavy shrink-0">
                    {course.employmentRate !== '—' ? `취업률 ${course.employmentRate}` : ''}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="다음 과정"
            className="absolute -right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#e1e5ea] bg-white/85 backdrop-blur-sm text-[#7c8796] shadow-[0_4px_12px_rgba(52,74,100,0.1)] transition-colors hover:border-waterlineBlue hover:text-deepOceanNavy md:-right-5"
          >
            →
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: Math.ceil(courses.length / visibleCardsCount) }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToPage(index)}
              aria-label={`${index + 1}페이지로 이동`}
              className={`h-2 rounded-full transition-all cursor-pointer ${index === activeIndex ? 'w-6 bg-deepOceanNavy' : 'w-2 bg-[#cdd6e0] hover:bg-[#b0c0d0]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
