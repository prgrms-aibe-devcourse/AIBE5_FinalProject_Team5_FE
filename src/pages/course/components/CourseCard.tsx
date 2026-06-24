/** 과정 카드 — 에디토리얼/타이포 레이아웃 (좌측 모노그램 · 타이틀 · 통계 · 점선 스펙) */

import type { KeyboardEvent } from 'react'
import type { Course } from '../../../services/course.ts'
import { isCourseStatPlaceholder } from '../../../services/course.ts'
import CourseThumbnail from './CourseThumbnail.tsx'

interface CourseCardProps {
  course: Course
  isSelected: boolean
  isBookmarked: boolean
  isBookmarkPending?: boolean
  canAddToCompare: boolean
  onToggleCompare: (course: Course) => void
  onToggleBookmark: () => void
  onOpenDetail?: (course: Course) => void
}

/** 라벨 ⋯⋯ 값 — 점선 리더 한 줄 */
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="shrink-0 text-[0.5625rem] tracking-[0.12em] text-secondary sm:text-[0.6875rem] sm:tracking-[0.15em]">{label}</span>
      <span
        aria-hidden="true"
        className="min-w-0 flex-1 translate-y-[-0.18em] border-b border-dotted border-mistSkyBlue"
      />
      <span className="line-clamp-1 min-w-0 text-right text-[0.5625rem] font-medium text-deepOceanNavy sm:text-[0.6875rem]">
        {value}
      </span>
    </div>
  )
}

/** 기수 뱃지 — glass-card·과정 상세 필과 동일한 글래스 톤 */
function BatchBadge({ batch }: { batch: string }) {
  const unavailable = batch === '-' || isCourseStatPlaceholder(batch)

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold leading-none shadow-[0_2px_8px_rgba(52,74,100,0.06)] backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[0.6875rem] ${
        unavailable
          ? 'border-mistSkyBlue/35 bg-white/25 text-secondary/55'
          : 'border-mistSkyBlue/45 bg-white/45 text-waterlineBlue'
      }`}
    >
      {batch}
    </span>
  )
}

/** 통계 1칸 — 라벨(위) / 값(아래) */
function StatCell({ label, value }: { label: string; value: string }) {
  const unavailable = isCourseStatPlaceholder(value)
  return (
    <div className="flex flex-1 flex-col items-center gap-1 text-center">
      <span className="text-[0.5625rem] tracking-[0.1em] text-secondary sm:text-[0.625rem] sm:tracking-[0.12em]">{label}</span>
      <span
        className={
          unavailable
            ? 'text-xs font-normal text-secondary/45 sm:text-sm'
            : 'text-xs font-bold text-deepOceanNavy sm:text-sm'
        }
      >
        {value}
      </span>
    </div>
  )
}

export default function CourseCard({
  course,
  isSelected,
  isBookmarked,
  isBookmarkPending = false,
  canAddToCompare,
  onToggleCompare,
  onToggleBookmark,
  onOpenDetail,
}: CourseCardProps) {
  const handleCardClick = () => onOpenDetail?.(course)
  const handleCardKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpenDetail?.(course)
    }
  }

  const actionButtonClass =
    'flex h-6 w-6 items-center justify-center rounded-full border bg-white/90 text-sm leading-none shadow-sm transition-colors sm:h-7 sm:w-7 sm:text-base'

  return (
    <article
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      onClick={onOpenDetail ? handleCardClick : undefined}
      onKeyDown={onOpenDetail ? handleCardKeyDown : undefined}
      className={`glass-card flex h-full w-full origin-center flex-col rounded-2xl px-3 pb-4 pt-3 font-pretendard transition duration-600 ease-out sm:rounded-[1.75rem] sm:px-5 sm:pb-5 sm:pt-4 md:hover:scale-[1.05] ${
        isSelected ? 'glass-card--selected' : ''
      } ${
        onOpenDetail
          ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-waterlineBlue'
          : ''
      }`}
    >
      {/* 상단 바: 기수 뱃지 / 액션 */}
      <div className="flex items-center justify-between border-b border-mistSkyBlue/60 pb-2 sm:pb-3">
        <BatchBadge batch={course.batch} />
        <div className="ml-2 flex shrink-0 gap-1.5">
          <button
            type="button"
            aria-label={isSelected ? '비교 목록에서 제거' : '비교 목록에 추가'}
            disabled={!isSelected && !canAddToCompare}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCompare(course)
            }}
            className={`${actionButtonClass} ${
              isSelected
                ? 'border-waterlineBlue text-waterlineBlue'
                : 'border-mistSkyBlue text-deepOceanNavy hover:border-waterlineBlue disabled:cursor-not-allowed disabled:opacity-40'
            }`}
          >
            {isSelected ? '✓' : '+'}
          </button>
          <button
            type="button"
            aria-label={isBookmarked ? '스크랩 해제' : '스크랩'}
            disabled={isBookmarkPending}
            onClick={(e) => {
              e.stopPropagation()
              onToggleBookmark()
            }}
            className={`${actionButtonClass} ${
              isBookmarked
                ? 'border-bookmarkRose bg-bookmarkRose/10 text-bookmarkRose'
                : 'border-mistSkyBlue text-softAquaBlue hover:border-bookmarkRose/50 hover:text-bookmarkRose'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} aria-hidden="true">
              <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 본문: 중앙 이미지 (풀 width) */}
      <div className="mt-3 overflow-hidden rounded-xl border border-white/70 shadow-sm sm:mt-4 sm:rounded-2xl">
        <CourseThumbnail imageUrl={course.logoUrl} company={course.company} seed={course.id} />
      </div>

      {/* 타이틀 + 기관 */}
      <div className="mt-2.5 sm:mt-3.5">
        <h2 className="line-clamp-2 text-[0.8125rem] font-bold leading-snug text-deepOceanNavy sm:text-[0.9375rem]">
          {course.title}
        </h2>
        <p className="mt-1 line-clamp-1 text-[0.6875rem] text-secondary sm:mt-1.5 sm:text-[0.75rem]">{course.company}</p>
      </div>

      <div className="mt-3 flex items-center border-y border-dashed border-mistSkyBlue py-2 sm:mt-5 sm:py-3">
        <StatCell label="만족도" value={course.satisfaction} />
        <span className="text-[0.625rem] text-softAquaBlue/60 sm:text-base" aria-hidden="true">·</span>
        <StatCell label="취업률" value={course.employmentRate} />
        <span className="text-[0.625rem] text-softAquaBlue/60 sm:text-base" aria-hidden="true">·</span>
        <StatCell label="별점" value={course.rating} />
      </div>

      <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:gap-2 sm:pt-5">
        <SpecRow label="지역" value={course.location} />
        <SpecRow label="수강료" value={course.price} />
        <SpecRow label="기간" value={course.dateRange} />
      </div>
    </article>
  )
}
