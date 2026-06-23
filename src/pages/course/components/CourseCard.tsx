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
      <span className="shrink-0 text-[0.6875rem] tracking-[0.15em] text-secondary">{label}</span>
      <span
        aria-hidden="true"
        className="min-w-0 flex-1 translate-y-[-0.18em] border-b border-dotted border-mistSkyBlue"
      />
      <span className="line-clamp-1 min-w-0 text-right text-[0.6875rem] font-medium text-deepOceanNavy">
        {value}
      </span>
    </div>
  )
}

/** 통계 1칸 — 라벨(위) / 값(아래) */
function StatCell({ label, value }: { label: string; value: string }) {
  const unavailable = isCourseStatPlaceholder(value)
  return (
    <div className="flex flex-1 flex-col items-center gap-1 text-center">
      <span className="text-[0.625rem] tracking-[0.12em] text-secondary">{label}</span>
      <span
        className={
          unavailable
            ? 'text-sm font-normal text-secondary/45'
            : 'text-sm font-bold text-deepOceanNavy'
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
    'flex h-7 w-7 items-center justify-center rounded-full border bg-white/90 text-base leading-none shadow-sm transition-colors'

  return (
    <article
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      onClick={onOpenDetail ? handleCardClick : undefined}
      onKeyDown={onOpenDetail ? handleCardKeyDown : undefined}
      className={`glass-card flex h-full w-full origin-center flex-col rounded-[1.75rem] px-5 pb-5 pt-4 font-pretendard transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.02] ${
        isSelected ? 'glass-card--selected' : ''
      } ${
        onOpenDetail
          ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-waterlineBlue'
          : ''
      }`}
    >
      {/* 상단 바: 지역 태그 / 액션 */}
      <div className="flex items-center justify-between border-b border-mistSkyBlue/60 pb-3">
        <span className="truncate text-[0.625rem] uppercase tracking-[0.2em] text-secondary">
          {course.location || 'COURSE'}
        </span>
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
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 shadow-sm">
        <CourseThumbnail imageUrl={course.logoUrl} company={course.company} seed={course.id} />
      </div>

      {/* 타이틀 + 기관 */}
      <div className="mt-3.5">
        <h2 className="line-clamp-2 text-[0.9375rem] font-bold leading-snug text-deepOceanNavy">
          {course.title}
        </h2>
        <p className="mt-1.5 line-clamp-1 text-[0.75rem] text-secondary">{course.company}</p>
      </div>

      {/* 통계: 점선 룰 사이 3칸 */}
      <div className="mt-5 flex items-center border-y border-dashed border-mistSkyBlue py-3">
        <StatCell label="만족도" value={course.satisfaction} />
        <span className="text-softAquaBlue/60" aria-hidden="true">·</span>
        <StatCell label="취업률" value={course.employmentRate} />
        <span className="text-softAquaBlue/60" aria-hidden="true">·</span>
        <StatCell label="별점" value={course.rating} />
      </div>

      {/* 스펙: 점선 리더 행 (하단 고정) */}
      <div className="mt-auto flex flex-col gap-2 pt-5">
        <SpecRow label="지역" value={course.location} />
        <SpecRow label="수강료" value={course.price} />
        <SpecRow label="기간" value={course.dateRange} />
      </div>
    </article>
  )
}
