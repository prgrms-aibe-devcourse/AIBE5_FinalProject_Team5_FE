import { useRef, useState } from 'react'
import { popularCourses } from '../homeData'

function CourseLogo() {
  return (
    <div className="grid h-24 w-full place-items-center rounded-xl bg-gradient-to-br from-[#eaf2f8] to-[#d8e6f0] text-3xl font-black tracking-tighter text-[#1f2937]">
      grepp.
    </div>
  )
}

export default function PopularCoursesSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector<HTMLElement>('[data-course-card]')
    const step = card ? card.offsetWidth + 20 : scroller.clientWidth
    scroller.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector<HTMLElement>('[data-course-card]')
    const step = card ? card.offsetWidth + 20 : 1
    setActiveIndex(Math.round(scroller.scrollLeft / step))
  }

  return (
    <section id="popular-courses" className="w-full bg-white px-6 py-12 md:px-12 md:py-16" aria-label="이번 주 인기 과정" data-home-section>
      <div className="mx-auto w-full max-w-desktop-content">
        <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">이번 주 인기 과정</h2>
        <p className="mt-2 text-center text-sm text-[#7b8795] font-pretendard">
          사용자들이 이번 주 가장 관심있어 한 과정을 확인해보세요
        </p>

        <div className="relative mt-8">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="이전 과정"
            className="absolute -left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#e1e5ea] bg-white text-[#7c8796] shadow-[0_4px_12px_rgba(52,74,100,0.1)] transition-colors hover:border-waterlineBlue hover:text-deepOceanNavy md:-left-5"
          >
            ←
          </button>

          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="mx-auto flex w-max snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {popularCourses.map((course) => (
              <article
                key={course.id}
                data-course-card
                className="w-[260px] shrink-0 snap-start rounded-2xl border border-[#e4e8ee] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-transform hover:-translate-y-1"
              >
                <CourseLogo />

                <h3 className="mt-4 line-clamp-2 min-h-[2.6rem] text-sm font-bold text-[#17202c] font-pretendard">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-[#6f7c8d] font-pretendard">{course.academy}</p>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#6f7c8d] font-pretendard">
                  <span>{course.region}</span>
                  <span className="text-[#d2d9e0]">|</span>
                  <span>{course.subsidy}원</span>
                  <span className="ml-auto font-semibold text-[#23a03b]">★ {course.rating}</span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#eef2f6] pt-3 text-xs text-[#6f7c8d] font-pretendard">
                  <span>{course.period}</span>
                  <span className="font-semibold text-deepOceanNavy">{course.capacity}</span>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="다음 과정"
            className="absolute -right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#e1e5ea] bg-white text-[#7c8796] shadow-[0_4px_12px_rgba(52,74,100,0.1)] transition-colors hover:border-waterlineBlue hover:text-deepOceanNavy md:-right-5"
          >
            →
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {popularCourses.map((course, index) => (
            <span
              key={course.id}
              className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-deepOceanNavy' : 'w-2 bg-[#cdd6e0]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
