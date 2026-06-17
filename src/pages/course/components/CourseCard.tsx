/** 과정 카드 1장 — 썸네일(이미지) / 메타 / 통계 / 비교·찜 액션 **/

import type { KeyboardEvent } from 'react'
import type { Course } from '../../../services/course.ts'
import { isCourseStatPlaceholder } from '../../../services/course.ts'
import CourseThumbnail from './CourseThumbnail.tsx'

interface CourseCardProps {
  course: Course
  isSelected: boolean
  isBookmarked: boolean
  canAddToCompare: boolean
  onToggleCompare: (course: Course) => void
  onToggleBookmark: (courseId: string) => void
  onOpenDetail?: (course: Course) => void
  size?: 'default' | 'compact'
}

/** 카드 본문 아이콘  */
function LocationIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function PriceIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CalendarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SatisfactionIcon({ className = 'h-[18px] w-[18px] text-softAquaBlue' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function EmploymentIcon({ className = 'h-[18px] w-[18px] text-softAquaBlue' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon({ className = 'h-[18px] w-[18px] text-softAquaBlue' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3l2.35 4.76 5.25.76-3.8 3.7.9 5.24L12 15.77l-4.7 2.47.9-5.24-3.8-3.7 5.25-.76L12 3z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
    </svg>
  )
}

function StatValue({ value, isCompact }: { value: string; isCompact: boolean }) {
  const unavailable = isCourseStatPlaceholder(value)
  return (
    <p
      className={
        unavailable
          ? isCompact
            ? 'text-[0.6875rem] font-normal text-secondary/50'
            : 'text-[clamp(0.75rem,3.5cqw,0.875rem)] font-normal text-secondary/50'
          : isCompact
            ? 'text-[0.6875rem] font-semibold text-deepOceanNavy'
            : 'text-[clamp(0.75rem,3.5cqw,0.875rem)] font-semibold text-deepOceanNavy'
      }
    >
      {value}
    </p>
  )
}

export default function CourseCard({
  course,
  isSelected,
  isBookmarked,
  canAddToCompare,
  onToggleCompare,
  onToggleBookmark,
  onOpenDetail,
  size = 'default',
}: CourseCardProps) {
  const isCompact = size === 'compact'
  const actionButtonClass = isCompact
    ? 'flex h-6 w-6 items-center justify-center rounded-full border bg-white/90 text-sm leading-none shadow-sm transition-colors'
    : 'flex h-7 w-7 items-center justify-center rounded-full border bg-white/90 text-base leading-none shadow-sm transition-colors sm:h-8 sm:w-8 sm:text-lg'
  const bookmarkIconClass = isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5 sm:h-4 sm:w-4'
  const statIconClass = isCompact ? 'h-3.5 w-3.5 text-softAquaBlue' : 'h-[18px] w-[18px] text-softAquaBlue'
  const metaIconSize = isCompact ? 12 : 14
  const handleCardClick = () => {
    onOpenDetail?.(course)
  }

  const handleCardKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpenDetail?.(course)
    }
  }

  return (
    <article
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      onClick={onOpenDetail ? handleCardClick : undefined}
      onKeyDown={onOpenDetail ? handleCardKeyDown : undefined}
      className={`@container flex w-full origin-center flex-col overflow-hidden glass-panel transition-[transform,box-shadow] duration-200 ease-out font-pretendard ${
        isCompact
          ? 'w-full rounded-xl hover:scale-[1.02] hover:shadow-md'
          : 'aspect-[340/450] max-w-full rounded-2xl hover:scale-[1.03] hover:shadow-md'
      } ${
        onOpenDetail ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-waterlineBlue' : ''
      }`}
    >
      <div className="relative shrink-0">
        <CourseThumbnail imageUrl={course.logoUrl} />
        <div className="absolute right-[6%] top-[6%] z-10 flex gap-1.5">
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
            aria-label={isBookmarked ? '찜 해제' : '찜하기'}
            onClick={(e) => {
              e.stopPropagation()
              onToggleBookmark(course.id)
            }}
            className={`${actionButtonClass} ${
              isBookmarked
                ? 'border-bookmarkRose bg-bookmarkRose/10 text-bookmarkRose'
                : 'border-mistSkyBlue text-softAquaBlue hover:border-bookmarkRose/50 hover:text-bookmarkRose'
            }`}
          >
            <svg className={bookmarkIconClass} viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} aria-hidden="true">
              <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 카드 본문 영역 */}
      <div className={isCompact ? 'flex flex-col' : 'flex min-h-0 flex-1 flex-col'}>
        <div
          className={
            isCompact
              ? 'flex flex-col px-3 pb-3 pt-2.5'
              : 'flex min-h-0 flex-1 flex-col px-[5%] pb-[4%] pt-[3%]'
          }
        >
          <div className="shrink-0">
            <h2
              className={
                isCompact
                  ? 'line-clamp-2 text-[0.8125rem] font-semibold leading-snug text-deepOceanNavy'
                  : 'line-clamp-2 min-h-0 text-[clamp(0.8125rem,4.2cqw,1rem)] font-semibold leading-snug text-deepOceanNavy'
              }
            >
              {course.title}
            </h2>
            <p
              className={
                isCompact
                  ? 'mt-0.5 line-clamp-1 text-[0.6875rem] text-secondary'
                  : 'mt-0.5 line-clamp-1 text-[clamp(0.75rem,3.5cqw,0.875rem)] text-secondary'
              }
            >
              {course.company}
            </p>
            <ul
              className={`shrink-0 flex flex-col leading-tight text-deepOceanNavy ${
                isCompact ? 'mt-2 gap-0.5 text-[0.6875rem]' : 'mt-3 gap-0.5 text-[clamp(0.75rem,3.5cqw,0.875rem)]'
              }`}
            >
              <li className="flex items-center gap-1.5">
                <LocationIcon size={metaIconSize} />
                <span className="line-clamp-1 min-w-0">{course.location}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <PriceIcon size={metaIconSize} />
                <span className="line-clamp-1 min-w-0">{course.price}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CalendarIcon size={metaIconSize} />
                <span className="line-clamp-1 min-w-0">{course.dateRange}</span>
              </li>
            </ul>
          </div>

          <div
            className={`grid shrink-0 grid-cols-3 divide-x divide-mistSkyBlue border-t border-mistSkyBlue/60 ${
              isCompact ? 'mt-3 gap-y-0.5 pt-2' : 'mt-auto pt-2'
            }`}
          >
            <div className="flex flex-col items-center gap-0.5 px-0.5 text-center">
              <SatisfactionIcon className={statIconClass} />
              <StatValue value={course.satisfaction} isCompact={isCompact} />
              <p
                className={
                  isCompact ? 'text-[0.625rem] text-secondary' : 'text-[clamp(0.625rem,2.8cqw,0.75rem)] text-secondary'
                }
              >
                만족도
              </p>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-0.5 text-center">
              <EmploymentIcon className={statIconClass} />
              <StatValue value={course.employmentRate} isCompact={isCompact} />
              <p
                className={
                  isCompact ? 'text-[0.625rem] text-secondary' : 'text-[clamp(0.625rem,2.8cqw,0.75rem)] text-secondary'
                }
              >
                취업률
              </p>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-0.5 text-center">
              <StarIcon className={statIconClass} />
              <StatValue value={course.rating} isCompact={isCompact} />
              <p
                className={
                  isCompact ? 'text-[0.625rem] text-secondary' : 'text-[clamp(0.625rem,2.8cqw,0.75rem)] text-secondary'
                }
              >
                별점
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
