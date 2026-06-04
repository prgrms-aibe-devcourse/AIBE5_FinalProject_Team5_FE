import { type FormEvent } from 'react'
import type { CourseFilterConfig } from '../../../services/course.ts'
import CourseFilterSelect from './CourseFilterSelect.tsx'

interface CourseSearchHeroProps {
  keyword: string
  onKeywordChange: (value: string) => void
  onSearch: () => void
  filters: CourseFilterConfig[]
  filterValues: Record<string, string>
  onFilterChange: (filterId: string, value: string) => void
}

export default function CourseSearchHero({
  keyword, // 검색창 입력값
  onKeywordChange, // 검색창 타이핑 시 keyword 갱신
  onSearch, // 검색 버튼·Enter 감지
  filters, // 필터 4종
  filterValues, // 필터별 현재 선택값
  onFilterChange, // 필터 변경 감지
}: CourseSearchHeroProps) {
  const handleSubmit = (e: FormEvent) => { // 검색 버튼·Enter 감지 시, 검색 함수 호출
    e.preventDefault()
    onSearch() 
  }

  return (
    <section
      className="relative z-20 w-full bg-white pt-8 md:pt-10"
      aria-label="과정 검색"
    >
      {/* blur 배경 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-[58%] h-40 w-[min(92vw,44rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(139,180,210,0.55)_0%,rgba(187,211,224,0.35)_45%,transparent_72%)] blur-3xl" />
        <div className="absolute left-1/2 top-[58%] h-28 w-[min(78vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-softAquaBlue/30 blur-2xl" />
      </div>
      
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 mx-auto w-full max-w-3xl overflow-visible px-6 pb-16 text-center font-pretendard md:px-12 md:pb-20">
        <h1 className="mb-8 text-2xl font-bold leading-snug text-deepOceanNavy md:mb-10 md:text-3xl">
          나에게 맞는 과정을 탐색해보세요!
        </h1>

        {/* 검색 바 */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-5 overflow-visible">
          <div className="relative w-full">
            {/* 키워드 입력 필드 */}
            <input
              type="search"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="키워드, 과정명 등 입력"
              className="w-full rounded-full border border-mistSkyBlue bg-white py-4 pl-6 pr-14 text-sm text-deepOceanNavy shadow-[0_4px_28px_rgba(34,130,168,0.28)] placeholder:text-softAquaBlue focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-[#2282A8]/20 md:text-base"
            />
            {/* 검색 버튼 */}
            <button
              type="submit"
              aria-label="검색"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-deepOceanNavy/70 transition-colors hover:text-waterlineBlue"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* 필터 4종 — 검색바보다 약간 짧은 너비 (92%) */}
          <div className="relative z-30 flex w-[92%] max-w-[calc(48rem*0.92)] flex-wrap items-center justify-center gap-2.5 overflow-visible sm:gap-3">
            {filters.map((filter) => (
              <CourseFilterSelect
                key={filter.id} // 필터 id
                filter={filter} // 필터 정보
                value={filterValues[filter.id] ?? filter.options[0]?.value ?? ''} // 필터 선택값
                onChange={(value) => onFilterChange(filter.id, value)} // 필터 변경 시 호출
              />
            ))}
          </div>
        </form>
      </div>

      {/* 하단 구분선 — main 콘텐츠(max-w-desktop-content)와 동일 너비 */}
      <div className="px-6 md:px-12">
        <div className="mx-auto w-full max-w-desktop-content border-b border-mistSkyBlue/60" />
      </div>
    </section>
  )
}
