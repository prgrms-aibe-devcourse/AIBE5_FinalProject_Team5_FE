/** 과정 카드 1장 — 썸네일(이미지) / 메타 / 통계 / 비교·찜 액션 **/

import type { Course } from '../../../services/course.ts'

interface CourseCardProps {  course: Course
  isSelected: boolean
  isBookmarked: boolean
  canAddToCompare: boolean
  onToggleCompare: (course: Course) => void
  onToggleBookmark: (courseId: string) => void
}

/** 카드 본문 아이콘  */
function LocationIcon() {   // 지역 아이콘
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function PriceIcon() {  // 가격 아이콘
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CalendarIcon() {  // 기간 아이콘
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SatisfactionIcon() {  // 만족도 아이콘
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-softAquaBlue" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function EmploymentIcon() {  // 취업률 아이콘
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-softAquaBlue" aria-hidden="true">
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon() {  // 별점 아이콘
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-softAquaBlue" aria-hidden="true">
      <path d="M12 3l2.35 4.76 5.25.76-3.8 3.7.9 5.24L12 15.77l-4.7 2.47.9-5.24-3.8-3.7 5.25-.76L12 3z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
    </svg>
  )
}

export default function CourseCard({  course, // 과정 정보
  isSelected, // 비교 목록 여부
  isBookmarked, // 찜 목록 여부
  canAddToCompare, // 비교 가능 여부
  onToggleCompare, // 비교 버튼 상태 
  onToggleBookmark, // 찜 버튼 상태 
}: CourseCardProps) {
  return (
    // 과정 카드 컨테이너
    <article className="@container flex aspect-[340/450] w-full max-w-full origin-center flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 bg-white shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.03] hover:shadow-md font-pretendard">
      {/* 상단: 썸네일 영역 */}
      <div className="relative aspect-[16/9] w-full shrink-0 bg-foamWhite">
        {/* 썸네일 이미지 */}
        {course.logoUrl ? ( <img src={course.logoUrl} alt="" className="h-full w-full object-cover"/>) : null}
        {/* 버튼 영역 */}
        <div className="absolute right-[6%] top-[6%] flex gap-1.5">
          {/* 비교 버튼 */}
          <button
            type="button"
            aria-label={isSelected ? '비교 목록에서 제거' : '비교 목록에 추가'}
            disabled={!isSelected && !canAddToCompare} // 비교 가능 여부에 따라 버튼 비활성화
            onClick={() => onToggleCompare(course)} // 비교 버튼 클릭 시 과정 추가/제거
            className={`flex h-7 w-7 items-center justify-center rounded-full border bg-white/90 text-base leading-none shadow-sm transition-colors sm:h-8 sm:w-8 sm:text-lg ${
              isSelected // 비교 목록 여부에 따라 버튼 상태 변경
                ? 'border-waterlineBlue text-waterlineBlue'
                : 'border-mistSkyBlue text-deepOceanNavy hover:border-waterlineBlue disabled:cursor-not-allowed disabled:opacity-40'
            }`}
          >
            {isSelected ? '✓' : '+'}
          </button>
          {/* 찜 버튼 */}
          <button
            type="button"
            aria-label={isBookmarked ? '찜 해제' : '찜하기'}
            onClick={() => onToggleBookmark(course.id)} // 찜 버튼 클릭 시 과정 추가/제거
            className={`flex h-7 w-7 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-colors sm:h-8 sm:w-8 ${
              isBookmarked // 찜 목록 여부에 따라 버튼 상태 변경
                ? 'border-waterlineBlue text-waterlineBlue'
                : 'border-mistSkyBlue text-softAquaBlue hover:border-waterlineBlue hover:text-waterlineBlue'
            }`}
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} aria-hidden="true">
              <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 카드 본문 영역 */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* 본문 콘텐츠 (중단 + 하단 통계) */}
        <div className="flex min-h-0 flex-1 flex-col px-[5%] pb-[4%] pt-[3%]">
          {/* 중단: 제목·기관 / 지역·가격·기간 */}
          <div className="shrink-0">
            {/* 제목. 기관명 */}
            <h2 className="line-clamp-2 min-h-0 text-[clamp(0.8125rem,4.2cqw,1rem)] font-semibold leading-snug text-deepOceanNavy">
              {course.title}
            </h2>
            <p className="mt-0.5 line-clamp-1 text-[clamp(0.75rem,3.5cqw,0.875rem)] text-secondary">
              {course.company}
            </p>
            {/* 지역·가격·기간 목록 */}
            <ul className="mt-3 shrink-0 flex flex-col gap-0.5 text-[clamp(0.75rem,3.5cqw,0.875rem)] leading-tight text-deepOceanNavy">
              <li className="flex items-center gap-1.5">
                <LocationIcon />
                <span className="line-clamp-1 min-w-0">{course.location}</span> {/* 지역 */}
              </li>
              <li className="flex items-center gap-1.5">
                <PriceIcon />
                <span className="line-clamp-1 min-w-0">{course.price}</span> {/* 가격 */}
              </li>
              <li className="flex items-center gap-1.5">
                <CalendarIcon />
                <span className="line-clamp-1 min-w-0">{course.dateRange}</span> {/* 기간 */}
              </li>
            </ul>
          </div>

          {/* 하단: 만족도·취업률·별점 — 남는 높이는 중단과 통계 사이 */}
          <div className="mt-auto shrink-0 grid grid-cols-3 divide-x divide-mistSkyBlue border-t border-mistSkyBlue/60 pt-2">
            <div className="flex flex-col items-center gap-0.5 px-0.5 text-center">
              <SatisfactionIcon />
              <p className="text-[clamp(0.75rem,3.5cqw,0.875rem)] font-semibold text-deepOceanNavy">
                {course.satisfaction}
              </p>
              <p className="text-[clamp(0.625rem,2.8cqw,0.75rem)] text-secondary">만족도</p>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-0.5 text-center">
              <EmploymentIcon />
              <p className="text-[clamp(0.75rem,3.5cqw,0.875rem)] font-semibold text-deepOceanNavy">
                {course.employmentRate}
              </p>
              <p className="text-[clamp(0.625rem,2.8cqw,0.75rem)] text-secondary">취업률</p>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-0.5 text-center">
              <StarIcon />
              <p className="text-[clamp(0.75rem,3.5cqw,0.875rem)] font-semibold text-deepOceanNavy">
                {course.rating}
              </p>
              <p className="text-[clamp(0.625rem,2.8cqw,0.75rem)] text-secondary">별점</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
